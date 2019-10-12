import React from "react";

import TranslatedRichText from "../components/TranslatedRichText";
import { useVideoDispatcher } from "../contexts/VideoContext";

export default function VideoPage(props) {
  const videoDispatcher = useVideoDispatcher();

  const playVideo = () => {
    videoDispatcher({ action: "show", key: "videoOne" });
  };

  return (
    <>
      <TranslatedRichText wrappingTag="h1">
        video-page.heading
      </TranslatedRichText>

      <button onClick={playVideo}>Play fullscreen video</button>
    </>
  );
}
