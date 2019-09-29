import React, { createElement, useRef, useCallback, useEffect } from "react";
// import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import PageTwo from "../pages/PageTwo";
import PageThree from "../pages/PageThree";
import PageFour from "../pages/PageFour";
import useRouter from "../hooks/useRouter";
import clamp from "lodash-es/clamp";

import { useGesture } from "react-use-gesture";
import { useSprings, animated } from "react-spring";

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/page-two",
    component: PageTwo
  },
  {
    path: "/page-three",
    component: PageThree
  },
  {
    path: "/page-four",
    component: PageFour
  }
];

export default function Main() {
  const { history } = useRouter();
  // using ref as changes to the index value don't re-render (spring does the rendering)
  const index = useRef(0);
  const main = useRef(null);
  const [springs, setSprings] = useSprings(routes.length, i => ({
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
    history.listen(location => {
      // we don't run on swipe location changes, only on <Link to={x} />
      if (location.state === "viaDrag") {
        return;
      }

      const indexOfRequestedRoute = routes.findIndex(x => {
        return x.path === location.pathname;
      });

      if (indexOfRequestedRoute === index.current) {
        return;
      }

      index.current = indexOfRequestedRoute;
      updateSprings();
    });
  }, [updateSprings, history, index]);

  const bind = useGesture({
    onDrag: ({
      down,
      movement: [xMovement],
      direction: [xDir],
      distance,
      cancel
    }) => {
      // pass the position to move to next
      if (down && distance > window.innerWidth / 2) {
        const newIndex = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          routes.length - 1
        );
        // stops drag going off the edge
        cancel((index.current = newIndex));

        history.push(routes[newIndex].path, "viaDrag");
      }
      // we pass xMovement on as this allows to element to move as it is dragged.
      updateSprings(down ? xMovement : 0);
    }
  });

  return (
    <main ref={main}>
      {springs.map(({ x, display }, i) => (
        <animated.div
          {...bind()}
          key={i}
          style={{
            display,
            transform: x.interpolate(x => `translate3d(${x}px,0,0)`)
          }}
        >
          {createElement(routes[i].component)}
        </animated.div>
      ))}
    </main>
  );
}
