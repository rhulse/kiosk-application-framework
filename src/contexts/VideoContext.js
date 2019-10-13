import React, { createContext, useReducer, useContext } from "react";

import videoData from "../content/videoData";

const defaultVideoInformation = {
  show: false,
  src: null,
  name: "None",
  description: "No description"
};

const getVideoInformation = key => {
  return videoData[key] || defaultVideoInformation;
};

const VideoContext = createContext(defaultVideoInformation);
const VideoReducerContext = createContext();

function useVideo() {
  const video = useContext(VideoContext);
  if (video === undefined) {
    throw new Error(`useVideo must be used within a VideoProvider`);
  }
  return video;
}

function useVideoDispatcher() {
  const videoDispatcher = useContext(VideoReducerContext);
  if (videoDispatcher === undefined) {
    throw new Error(`useVideoDispathcer must be used within a VideoProvider`);
  }
  return videoDispatcher;
}

const videoReducer = (state, payload) => {
  switch (payload.action) {
    case "show":
      const videoInformation = getVideoInformation(payload.key);
      return { ...state, ...videoInformation, show: true };

    case "hide":
      return { ...defaultVideoInformation };

    default:
      return state;
  }
};

const VideoProvider = props => {
  const [video, videoDispatcher] = useReducer(
    videoReducer,
    defaultVideoInformation
  );

  return (
    <VideoContext.Provider value={video}>
      <VideoReducerContext.Provider value={videoDispatcher}>
        {props.children}
      </VideoReducerContext.Provider>
    </VideoContext.Provider>
  );
};

export { VideoProvider, useVideo, useVideoDispatcher, getVideoInformation };
