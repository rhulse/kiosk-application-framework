import React, { useRef, useState, useCallback } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import ReactAudioPlayer from "./ReactAudioPlayer";

import {
  dispatchPlayingEvent,
  useStopMediaEventListener
} from "../../utils/dom-events";

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [icon, setIcon] = useState(faPlay);

  const play = useCallback(
    e => {
      e.preventDefault();
      audioRef.current.play();
    },
    [audioRef]
  );

  const pause = useCallback(
    e => {
      e.preventDefault();
      audioRef.current.pause();
      setIcon(faPlay);
    },
    [audioRef]
  );

  useStopMediaEventListener(pause);

  return (
    <>
      <button className="audio-button" onClick={play}>
        <FontAwesomeIcon icon={icon} size="1x" />
      </button>
      <ReactAudioPlayer
        ref={audioRef}
        onTimeUpdate={dispatchPlayingEvent}
        onPlay={() => {
          setIcon(faPause);
        }}
        onEnded={() => {
          setIcon(faPlay);
        }}
        src={src}
      />
    </>
  );
}
