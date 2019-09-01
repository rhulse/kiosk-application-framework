import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import PageTwo from "../pages/PageTwo";

export default function Main() {
  return (
    <main className="m-4">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/page-two" component={PageTwo} />
      </Switch>
    </main>
  );
}
