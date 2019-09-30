import React from "react";

import RoutingSlider from "./RoutingSlider";
import Home from "../pages/Home";
import PageTwo from "../pages/PageTwo";
import PageThree from "../pages/PageThree";
import PageFour from "../pages/PageFour";

export default function Main() {
  return (
    <RoutingSlider>
      <Home path={"/"} />
      <PageTwo path={"/page-two"} />
      <PageThree path={"/page-three"} />
      <PageFour path={"/page-four"} />
    </RoutingSlider>
  );
}
