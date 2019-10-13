import React from "react";
import Icon, { play } from "../Icon";

import {
  useVideoDispatcher,
  getVideoInformation
} from "../../contexts/VideoContext";

/*
  Video poster is named and stlyed after the poster in the Te Papa DLS
  https://dls.tepapa.govt.nz/_pages/patterns/video/

*/

export default function VideoPoster({ videoKey }) {
  const videoInfo = getVideoInformation(videoKey);
  const videoDispatcher = useVideoDispatcher();

  const playVideo = () => {
    videoDispatcher({ action: "show", key: videoKey });
  };

  return (
    <div className="video-poster" onClick={playVideo}>
      <Icon icon={play} size="5x" />
      <div className="video-poster__information">
        <div className="name">{videoInfo.name}</div>
        <div className="duration">{videoInfo.duration}</div>
      </div>
    </div>
  );
}
