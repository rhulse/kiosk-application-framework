import React from "react";

import RoutingSlider from "./RoutableSlider";
import Home from "../pages/Home";
import PageTwo from "../pages/PageTwo";
import PageThree from "../pages/PageThree";
import PageFour from "../pages/PageFour";

export default function Main() {
  return (
    <main>
      <RoutingSlider>
        <Home path={"/"} />
        <PageTwo path={"/page-two"} />
        <PageThree path={"/page-three"} />
        <PageFour path={"/page-four"} />
      </RoutingSlider>
    </main>
  );
}
