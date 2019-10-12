import React, { useRef } from "react";
import { createPortal } from "react-dom";
import Icon, { close, speaker } from "./Icon";
import { useAnalytics } from "../analytics/Analytics";

import AudioPlayer from "./audio/ReactAudioPlayer";

import { useGloss, useGlossDispatcher } from "../contexts/GlossContext";

import {
  useStopMediaEventListener,
  dispatchPlayingEvent,
  dispatchStopMediaEvent
} from "../utils/dom-events";

const defaultPosition = {
  position: "absolute",
  left: "-98696px",
  top: "-98696px"
};

const downEventTypes = ["mousedown", "touchdown"];

const calculateGlossXY = (glossContainer, clickedElement) => {
  const { top, left, width } = clickedElement.getBoundingClientRect();
  const ARROW_SIZE = 14;

  const {
    height: glossHeight,
    width: glossWidth
  } = glossContainer.getBoundingClientRect();

  const glossLeftOffset = glossWidth / 2;

  const middleOfElement = width / 2;
  const newLeft = left + middleOfElement - glossLeftOffset;
  const newTop = top - glossHeight - ARROW_SIZE;

  return { top: newTop, left: newLeft };
};

export default function Gloss() {
  const glossContainerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const isPlaying = useRef(false);
  const analytics = useAnalytics();
  let glossPosition = defaultPosition;

  let {
    show,
    callingEvent,
    word,
    description,
    language,
    partOfSpeech,
    audioFile
  } = useGloss();

  const glossDispatcher = useGlossDispatcher();

  const play = event => {
    event.preventDefault();

    if (!audioPlayerRef.current || isPlaying.current) {
      return;
    }

    audioPlayerRef.current.play();

    analytics.event({
      eventCategory: "Gloss",
      eventAction: "Play",
      eventLabel: word
    });
  };

  const pause = event => {
    event.preventDefault();
    if (!audioPlayerRef.current || !isPlaying.current) {
      return;
    }
    audioPlayerRef.current.pause();
  };

  useStopMediaEventListener(pause);

  const hide = event => {
    event.preventDefault();
    if (isPlaying.current) {
      dispatchStopMediaEvent();
    }

    removeCheckForExternalClicks();

    glossDispatcher({ action: "hide" });

    glossPosition = defaultPosition;

    /*
        We don't track the close event on Gloss. Close events just clutter 
        up the analytics. If a Gloss is opened - and we DO care about tracking 
        what word was clicked - it has to close at some stage. Knowing that it
        was closed tells us nothing. What goes up, must come down. QED.
        
        The length of the open *might* be useful, but I doubt it. In the case of
        audio (if available), the numbers of plays per open would be more useful.
        */
  };

  const showGloss = () => {
    dispatchStopMediaEvent();

    const glossedElement = callingEvent.target;

    // then calulate XY based on the size
    glossPosition = calculateGlossXY(glossContainerRef.current, glossedElement);

    addCheckForExternalClicks();

    analytics.event({
      eventCategory: "Gloss",
      eventAction: "Show",
      eventLabel: word
    });
  };

  const checkForExternalAction = event => {
    if (!glossContainerRef.current.contains(event.target)) {
      hide(event);
    }
  };

  const addCheckForExternalClicks = () => {
    downEventTypes.forEach(eventType => {
      window.addEventListener(eventType, checkForExternalAction);
    });
  };

  const removeCheckForExternalClicks = () => {
    downEventTypes.forEach(eventType => {
      window.removeEventListener(eventType, checkForExternalAction);
    });
  };

  if (show) {
    showGloss();
  }

  /* 
        we create the portal directly (rather than show &&) because the gloss content 
        changes and the position has to be calculated each time.
        */
  return createPortal(
    <div
      // store on 'this' rather than state to avoid a rerender
      ref={glossContainerRef}
      style={{ ...glossPosition }}
      className="gloss"
    >
      <Icon icon={close} size="1x" onClick={hide} className="gloss-close" />
      <h6>
        {audioFile && (
          <>
            <button className="audio-button" onClick={play}>
              <Icon icon={speaker} size="1x" />
            </button>{" "}
            <AudioPlayer
              src={audioFile}
              onTimeUpdate={dispatchPlayingEvent}
              onPlay={() => {
                isPlaying.current = true;
              }}
              onPause={() => {
                isPlaying.current = false;
              }}
              onEnded={() => {
                isPlaying.current = false;
              }}
              ref={audioPlayerRef}
            />
          </>
        )}
        {word}
      </h6>
      <p>{description}</p>
      <p>
        {language} | {partOfSpeech}
      </p>
    </div>,
    document.body
  );
}
