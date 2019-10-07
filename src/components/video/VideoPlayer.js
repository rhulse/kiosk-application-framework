import React, { useRef, useCallback, useEffect } from "react";
import { Player } from "video-react";

import {
  dispatchPlayingEvent,
  useStopMediaEventListener
} from "../../utils/dom-events";

export default function VideoPlayer(props) {
  const playerRef = useRef();

  const onStateChange = useCallback(state => {
    dispatchPlayingEvent();
  }, []);

  useEffect(() => {
    playerRef.current.subscribeToStateChange(onStateChange);
  }, [onStateChange]);

  const stop = useCallback(() => {
    playerRef.current.pause();
    playerRef.current.seek(0);
  }, [playerRef]);

  useStopMediaEventListener(stop);

  return <Player ref={playerRef} {...props} />;
}
