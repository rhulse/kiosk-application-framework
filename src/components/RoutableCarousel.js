import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { useSprings, animated } from "react-spring";
import { useGesture } from "react-use-gesture";
import { Link } from "react-router-dom";
import clamp from "lodash-es/clamp";
import get from "lodash-es/get";

import Icon, { chevronLeft, chevronRight } from "./Icon";
import useRouter from "../hooks/useRouter";
import { useAnalytics } from "../analytics/Analytics";

class Routes {
  constructor(routes) {
    this.routes = routes;
  }

  length = () => {
    return this.routes.length;
  };

  getIndexOfRoute = pathname => {
    return this.routes.findIndex(x => {
      return x.path === pathname;
    });
  };

  getPathByIndex = index => {
    return this.routes[index].path;
  };

  getComponentByIndex = index => {
    return this.routes[index].component;
  };

  getPreviousRouteForIndex = i => {
    const index = i.current;

    if (index > 0) {
      return this.getPathByIndex(index - 1);
    } else {
      return this.getPathByIndex(this.length() - 1);
    }
  };

  getNextRouteForIndex = i => {
    const index = i.current;

    if (index < this.length() - 1) {
      return this.getPathByIndex(index + 1);
    } else {
      return this.getPathByIndex(0);
    }
  };
}

const compileRoutes = children => {
  const routes = children.map(child => {
    if (child.props.path === undefined) {
      throw new Error(
        "All children of Routable Carousel must have a 'path' prop"
      );
    }
    return {
      path: child.props.path,
      component: child
    };
  });
  return new Routes(routes);
};

export default function RoutingCarousel({ children, carouselName = "Main" }) {
  const analytics = useAnalytics();
  const routes = useMemo(() => compileRoutes(children), [children]);

  const { history } = useRouter();
  // using ref as changes to the index value don't re-render (spring does the rendering)
  const index = useRef(0);
  const [springs, setSprings] = useSprings(routes.length(), i => ({
    x: i * window.innerWidth,
    display: "block"
  }));

  const updateSprings = useCallback(
    (offset = 0) => {
      setSprings(i => {
        const x = (i - index.current) * window.innerWidth + offset;
        /*
          We update the position of pages even though they are hidden so
          that when we slide past more then one (when a link is clicked) 
          they still appear in the correct sequence as the slide by.
        */
        if (i < index.current - 1 || i > index.current + 1) {
          return { x, display: "none" };
        }
        return { x, display: "block" };
      });
    },
    [index, setSprings]
  );

  useEffect(() => {
    const unlistenCallback = history.listen(location => {
      /*
        This handles <Link to={} /> requests for the component, but only accepts changes
        for this component by `carouselName`.
        
        This allows us to use the component more than once in 
        a project by giving each component its own name.
      */
      const targetCarousel = get(location, "state.targetCarousel", false);

      if (targetCarousel !== carouselName) {
        return;
      }

      const navAction = get(location, "state.action", false);

      // track the specific navigation action types
      // can be useful to learn what the user's preferences were for an interactive
      // and to compare accross all interactives in a museum.
      if (navAction) {
        analytics.event({
          eventCategory: `${carouselName} Nav`,
          eventAction: navAction
        });
      }

      // We don't run on swipe location changes - swip actions are handled in the useGesture function
      if (navAction === "viaDrag") {
        return;
      }

      const indexOfRequestedRoute = routes.getIndexOfRoute(location.pathname);

      if (indexOfRequestedRoute === index.current) {
        return;
      }

      index.current = indexOfRequestedRoute;
      // the index has changed, so we update springs, which will then slide the content to the new index
      updateSprings();
    });

    return unlistenCallback;
  }, [routes, updateSprings, history, index, carouselName, analytics]);

  const bind = useGesture({
    onDrag: ({
      event,
      down,
      movement: [xMovement],
      direction: [xDir],
      distance,
      cancel
    }) => {
      event.stopPropagation();
      // pass the position to move to next
      if (down && distance > window.innerWidth / 2) {
        const newIndex = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          routes.length() - 1
        );
        // stops drag going off the edge
        cancel((index.current = newIndex));

        history.push(routes.getPathByIndex(newIndex), {
          targetCarousel: carouselName,
          action: "viaDrag"
        });
      }
      // we pass xMovement on as this allows to element to move as it is dragged.
      updateSprings(down ? xMovement : 0);
    }
  });

  return (
    <div className={"c-routable-slider"}>
      <Link
        to={{
          pathname: routes.getPreviousRouteForIndex(index),
          state: {
            targetCarousel: carouselName,
            action: "viaChevron"
          }
        }}
        className="slider-arrow sliderArrow__left"
      >
        <Icon icon={chevronLeft} size="2x" />
      </Link>
      <div className="slides">
        {springs.map(({ x, display }, i) => (
          <animated.div
            {...bind()}
            key={i}
            style={{
              display,
              transform: x.interpolate(x => `translate3d(${x}px,0,0)`)
            }}
          >
            <div className="slide">{routes.getComponentByIndex(i)}</div>
          </animated.div>
        ))}
      </div>
      <Link
        to={{
          pathname: routes.getNextRouteForIndex(index),
          state: {
            targetCarousel: carouselName,
            action: "viaChevron"
          }
        }}
        className="slider-arrow sliderArrow__right"
      >
        <Icon icon={chevronRight} size="2x" />
      </Link>
    </div>
  );
}
