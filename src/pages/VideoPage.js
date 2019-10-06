import React, { useRef, useCallback, useEffect } from "react";
import { Player } from "video-react";

import {
  dispatchPlayingEvent,
  useStopMediaEventListener
} from "../utils/dom-events";

const onStateChange = state => {
  dispatchPlayingEvent();
};

export default function VideoPage(props) {
  const playerRef = useRef();

  const stop = useCallback(() => {
    playerRef.current.pause();
    playerRef.current.seek(0);
  }, [playerRef]);

  useStopMediaEventListener(stop);

  useEffect(() => {
    playerRef.current.subscribeToStateChange(onStateChange);
  }, []);

  return (
    <>
      <Player
        ref={playerRef}
        playsInline
        poster="/assets/poster.png"
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
      />
    </>
  );
}
