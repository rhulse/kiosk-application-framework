import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp as speaker } from "@fortawesome/free-solid-svg-icons";

import glossData from "../content/glossData";
import { TrackerContext } from "../contexts/EventTracker";
import {
  dispatchPlayingEvent,
  dispatchStopMediaEvent
} from "../utils/dom-events";
import AudioPlayer from "./Audio/ReactAudioPlayer";

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

  state = { ...defaultPosition, ...defaultGlossInformation };

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
  };

  hide = event => {
    // if called by screen saver no event...
    event && event.preventDefault();
    dispatchStopMediaEvent();
    this._onEnded();

    this._removeCheckForExternalClicks();

    this.setState({ ...defaultPosition, ...defaultGlossInformation });
    /*
      We don't track the close event on Gloss. Close events just clutter 
      up the analytics. If a Gloss is opened - and we DO care about tracking 
      what word was clicked - it has to close at some stage. Knowing that it
      was closed tells us nothing. What goes up, must come down. QED.

      The length of the open *might* be useful, but I doubt it. In the case of
      audio (if available), the numbers of plays per open would be more useful.
    */
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

  _onPlay = () => {
    this.playing = true;
  };

  _onEnded = () => {
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
        <span onClick={this.hide} className="gloss-close">
          X
        </span>
        <h6>
          {audioFile && (
            <>
              <button className="audio-button" onClick={this._play}>
                <FontAwesomeIcon icon={speaker} size="1x" />
              </button>{" "}
              <AudioPlayer
                src={audioFile}
                onTimeUpdate={dispatchPlayingEvent}
                onPlay={this._onPlay}
                onEnded={this._onEnded}
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
