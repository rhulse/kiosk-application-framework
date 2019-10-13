import React, { useRef, useCallback } from "react";
import { createPortal } from "react-dom";

import FullScreenOverlayContainer from "../FullScreenOverlay";
import VideoPlayer from "./VideoPlayer";
import { useVideo, useVideoDispatcher } from "../../contexts/VideoContext";
import { useAnalytics } from "../../analytics/Analytics";

import {
  useStopMediaEventListener,
  dispatchPlayingEvent
} from "../../utils/dom-events";
/*
  When doing fullscreen video, the containing element needs to be fullscreen
  already, as it is not possible to make the player go fullscreen without
  throwing and exception (going fullscreen cannot be done programatically - it
  requires user intervention)
*/

export default function FullScreenVideoPlayer() {
  const timingData = useRef();
  const videoData = useVideo();
  const videoDispatcher = useVideoDispatcher();
  const analytics = useAnalytics();

  let playing = false;

  const videoEvent = type => {
    analytics.event({
      eventCategory: "Video",
      eventAction: type,
      eventLabel: videoData.name
    });

    // add timing events for Ended and Closed
    if (type !== "Play") {
      analytics.timing({
        timingCategory: "Video",
        timingVar: "Length",
        timingValue: Math.ceil(timingData.current.playedSeconds),
        timingLabel: `${type}: ${videoData.name}`
      });
    }
  };

  const play = () => {
    playing = true;
  };

  const pause = () => {
    playing = false;
  };

  const onProgress = useCallback(
    data => {
      dispatchPlayingEvent();
      timingData.current = data;
    },
    [timingData]
  );

  const onClose = () => {
    pause();
    videoEvent("Closed");
    videoDispatcher({ action: "hide" });
  };

  const onEnded = () => {
    videoEvent("Ended");
    videoDispatcher({ action: "hide" });
  };

  if (videoData.show) {
    videoEvent("Play");
    play();
  }

  useStopMediaEventListener(pause);

  return createPortal(
    <FullScreenOverlayContainer
      show={videoData.show}
      className="video-player"
      onClose={onClose}
    >
      <VideoPlayer
        playing={playing}
        src={videoData.src}
        onEnded={onEnded}
        onProgress={onProgress}
      />
    </FullScreenOverlayContainer>,
    document.body
  );
}
