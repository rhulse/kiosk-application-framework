import React from "react";

import RoutingSlider from "./RoutableSlider";
import Home from "../pages/Home";
import PageOne from "../pages/PageOne";
import PageTwo from "../pages/PageTwo";
import PageThree from "../pages/PageThree";

export default function Main() {
  return (
    <main>
      <RoutingSlider>
        <Home path={"/"} />
        <PageOne path={"/page-one"} />
        <PageTwo path={"/page-two"} />
        <PageThree path={"/page-three"} />
      </RoutingSlider>
    </main>
  );
}
