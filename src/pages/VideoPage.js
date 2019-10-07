import React from "react";
import VideoPlayer from "../components/video/VideoPlayer";

export default function VideoPage(props) {
  return (
    <>
      <VideoPlayer src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
    </>
  );
}
