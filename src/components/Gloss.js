import React, { Component } from "react";

import Icon, { close, speaker } from "./Icon";

import glossData from "../content/glossData";
import { TrackerContext } from "../contexts/EventTracker";
import {
  dispatchPlayingEvent,
  dispatchStopMediaEvent,
  addStopMediaEventListener,
  removeStopMediaEventListener
} from "../utils/dom-events";

import AudioPlayer from "./audio/ReactAudioPlayer";

/* 
  Design Note

  The design was complicated by the need to dyamically update the gloss content
  for each work clicked.

  The Gloss component includes all Gloss related logic, including that used
  to attach the gloss to any onClick events. This approach was taken - rather
  than moving the add/remove event to specific components - in order to encasulate
  all Gloss-related concerns in one place.
  
  This make it simpler to maintain, and the add/remove won't have to be repeated

  That choice did mean storing a gloss object reference in the Global state, so it 
  could be accessed anywhere. Better of two evils, IMHO.

*/

const defaultPosition = {
  position: "absolute",
  left: "-9990px",
  top: "-9990px"
};

const defaultGlossInformation = {
  word: "Unknown Word",
  description: "No desciption",
  language: "No Lang",
  partOfSpeech: "No Part",
  audioFile: ""
};

const downEventTypes = ["mousedown", "touchdown"];

export default class Gloss extends Component {
  static contextType = TrackerContext;

  playing = false;
  showing = false;

  state = { ...defaultPosition, ...defaultGlossInformation };

  componentDidMount = () => {
    addStopMediaEventListener(this._pause);
  };

  componentWillUnmount = () => {
    removeStopMediaEventListener(this._pause);
  };

  analyticsEvent = event => {
    this.context.analytics.event(event);
  };

  show = event => {
    event.preventDefault();
    dispatchStopMediaEvent();

    const glossedElement = event.target;

    const wordInformation = this._getWordInformation(glossedElement);

    // set the words first
    this.setState({
      ...wordInformation
    });

    // then calulate XY based on the size
    const glossXY = this._calculateGlossXY(glossedElement);

    this._addCheckForExternalClicks();

    this.setState({
      ...glossXY
    });

    this.analyticsEvent({
      eventCategory: "Gloss",
      eventAction: "Open",
      eventLabel: this.state.clickedWord
    });

    this.showing = true;
  };

  hide = event => {
    if (!this.showing) {
      return;
    }

    // if called by screen saver (i.e. with no event...)
    event && event.preventDefault();

    if (this.playing) {
      dispatchStopMediaEvent();
    }
    this._notPlaying();

    this._removeCheckForExternalClicks();

    // this state change stop the gloss playing although we
    // also dispatch a stop event above (which the AudioPlayer responds to)
    this.setState({ ...defaultPosition, ...defaultGlossInformation });
    /*
      We don't track the close event on Gloss. Close events just clutter 
      up the analytics. If a Gloss is opened - and we DO care about tracking 
      what word was clicked - it has to close at some stage. Knowing that it
      was closed tells us nothing. What goes up, must come down. QED.

      The length of the open *might* be useful, but I doubt it. In the case of
      audio (if available), the numbers of plays per open would be more useful.
    */
    this.showing = false;
  };

  addGlossListeners = containerElement => {
    const glossElements = this._fetchGlossElements(containerElement);

    glossElements.forEach(glossElement => {
      glossElement.addEventListener("click", this.show);
    });
  };

  removeGlossListeners = containerElement => {
    const glossElements = this._fetchGlossElements(containerElement);

    glossElements.forEach(glossElement => {
      glossElement.removeEventListener("click", this.show);
    });
  };

  styles = () => {
    const { top, left } = this.state;

    return { ...defaultPosition, top: top, left: left };
  };

  _play = e => {
    e.preventDefault();

    if (!this.audioPlayer || this.playing) {
      return;
    }

    this.audioPlayer.play();

    this.analyticsEvent({
      eventCategory: "Gloss",
      eventAction: "Play",
      eventLabel: this.state.clickedWord
    });
  };

  _pause = e => {
    e.preventDefault();

    if (!this.audioPlayer || !this.playing) {
      return;
    }

    this.audioPlayer.pause();
  };

  _isPlaying = () => {
    this.playing = true;
  };

  _notPlaying = () => {
    this.playing = false;
  };

  render() {
    const { word, description, language, partOfSpeech, audioFile } = this.state;

    return (
      <div
        // store on 'this' rather than state to avoid a rerender
        ref={ref => (this.glossContainer = ref)}
        style={this.styles()}
        className="gloss"
      >
        <Icon
          icon={close}
          size="1x"
          onClick={this.hide}
          className="gloss-close"
        />
        <h6>
          {audioFile && (
            <>
              <button className="audio-button" onClick={this._play}>
                <Icon icon={speaker} size="1x" />
              </button>{" "}
              <AudioPlayer
                src={audioFile}
                onTimeUpdate={dispatchPlayingEvent}
                onPlay={this._isPlaying}
                onPause={this._notPlaying}
                onEnded={this._notPlaying}
                ref={ref => {
                  this.audioPlayer = ref;
                }}
              />
            </>
          )}
          {word}
        </h6>
        <p>{description}</p>
        <p>
          {language} | {partOfSpeech}
        </p>
      </div>
    );
  }
  _getWordInformation = element => {
    const contentKey = element.getAttribute("data-gloss");

    const info = glossData[contentKey] || defaultGlossInformation;

    return {
      clickedWord: element.innerHTML,
      word: info.word,
      description: info.description,
      language: info.language,
      partOfSpeech: info.partOfSpeech,
      audioFile: info.audioFile
    };
  };

  _calculateGlossXY = element => {
    const { top, left, width } = element.getBoundingClientRect();
    const ARROW_SIZE = 14;

    const {
      height: glossHeight,
      width: glossWidth
    } = this.glossContainer.getBoundingClientRect();

    const glossLeftOffset = glossWidth / 2;

    const middleOfElement = width / 2;
    const newLeft = left + middleOfElement - glossLeftOffset;
    const newTop = top - glossHeight - ARROW_SIZE;

    return { top: newTop, left: newLeft };
  };

  _checkForExternalAction = event => {
    if (!this.glossContainer.contains(event.target)) {
      this.hide();
    }
  };

  _addCheckForExternalClicks = () => {
    downEventTypes.forEach(eventType => {
      window.addEventListener(eventType, this._checkForExternalAction);
    });
  };

  _removeCheckForExternalClicks = () => {
    downEventTypes.forEach(eventType => {
      window.removeEventListener(eventType, this._checkForExternalAction);
    });
  };

  _fetchGlossElements(containerElement) {
    return containerElement.querySelectorAll("[data-gloss]");
  }
}
