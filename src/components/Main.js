import React from "react";

import RoutableCarousel from "./RoutableCarousel";
import Home from "../pages/Home";
import PageOne from "../pages/PageOne";
import PageTwo from "../pages/PageTwo";
import PageThree from "../pages/PageThree";

export default function Main() {
  return (
    <main>
      <RoutableCarousel>
        <Home path={"/"} />
        <PageOne path={"/page-one"} />
        <PageTwo path={"/page-two"} />
        <PageThree path={"/page-three"} />
      </RoutableCarousel>
    </main>
  );
}
