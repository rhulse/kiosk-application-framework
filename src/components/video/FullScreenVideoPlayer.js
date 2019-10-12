import React from "react";
import { createPortal } from "react-dom";

import FullScreenOverlayContainer from "../FullScreenOverlay";
import VideoPlayer from "./VideoPlayer";
import { useVideo, useVideoDispatcher } from "../../contexts/VideoContext";

import { useStopMediaEventListener } from "../../utils/dom-events";
/*
  When doing fullscreen video, the containing element needs to be fullscreen
  already, as it is not possible to make the player go fullscreen without
  throwing and exception (going fullscreen cannot be done programatically - it
  requires user intervention)
*/

export default function FullScreenVideoPlayer() {
  const videoData = useVideo();
  const videoDispatcher = useVideoDispatcher();
  let playing = false;

  const onClose = () => {
    pause();
    videoDispatcher({ action: "hide" });
  };

  const play = () => {
    playing = true;
  };

  const pause = () => {
    playing = false;
  };

  const onEnded = () => {
    videoDispatcher({ action: "hide" });
  };

  if (videoData.show) {
    play();
  }

  useStopMediaEventListener(pause);

  return createPortal(
    <FullScreenOverlayContainer
      show={videoData.show}
      className="video-player"
      onClose={onClose}
    >
      <VideoPlayer playing={playing} src={videoData.src} onEnded={onEnded} />
    </FullScreenOverlayContainer>,
    document.body
  );
}
