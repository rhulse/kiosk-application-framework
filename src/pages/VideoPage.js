import React from "react";

import TranslatedRichText from "../components/TranslatedRichText";
import VideoPoster from "../components/video/VideoPoster";

export default function VideoPage(props) {
  return (
    <>
      <TranslatedRichText wrappingTag="h1">
        video-page.heading
      </TranslatedRichText>

      <VideoPoster videoKey="videoOne" />
    </>
  );
}
