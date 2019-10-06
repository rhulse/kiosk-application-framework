import React from "react";

import RoutableCarousel from "./RoutableCarousel";
import Home from "../pages/Home";
import PageOne from "../pages/PageOne";
import PageTwo from "../pages/PageTwo";
import PageThree from "../pages/PageThree";
import VideoPage from "../pages/VideoPage";

export default function Main() {
  return (
    <main>
      <RoutableCarousel>
        <Home path={"/"} />
        <PageOne path={"/page-one"} />
        <PageTwo path={"/page-two"} />
        <PageThree path={"/page-three"} />
        <VideoPage path={"/video-page"} />
      </RoutableCarousel>
    </main>
  );
}
