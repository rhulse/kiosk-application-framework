export class Routes {
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

export const compileRoutes = children => {
  const routes = children.map(child => {
    if (child.props.path === undefined) {
      throw new Error("All children of must have a 'path' prop");
    }
    return {
      path: child.props.path,
      component: child
    };
  });
  return new Routes(routes);
};
