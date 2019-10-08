import React, { useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import ReactAudioPlayer from "./ReactAudioPlayer";

import {
  dispatchPlayingEvent,
  useStopMediaEventListener
} from "../../utils/dom-events";

export default function AudioPlayer(props) {
  const audioRef = useRef(null);
  const [icon, setIcon] = useState(faPlay);

  const play = useCallback(
    e => {
      e.preventDefault();
      audioRef.current.play();
      props.onPlay && props.onPlay();
    },
    [audioRef, props]
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
        src={props.src}
      />
    </>
  );
}

ReactAudioPlayer.propTypes = {
  src: PropTypes.string,
  onPlay: PropTypes.func
};
