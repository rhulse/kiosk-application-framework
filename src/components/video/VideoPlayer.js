import React from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer(props) {
  return (
    <ReactPlayer
      width="100%"
      height="100%"
      url={props.src}
      playing={props.playing}
      controls={true}
      onEnded={props.onEnded}
      onProgress={props.onProgress}
    />
  );
}
