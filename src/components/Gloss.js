import React, { Component } from "react";
import glossData from "../content/glossData";

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
  description: "No Data for Word",
  language: "Lang",
  partOfSpeech: "Noun"
};

const downEventTypes = ["mousedown", "touchdown"];

export default class Gloss extends Component {
  state = { ...defaultPosition, ...defaultGlossInformation };

  show = event => {
    event.preventDefault();

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
  };

  hide = event => {
    // called by screen saver, so no event...
    event && event.preventDefault();
    this._removeCheckForExternalClicks();

    this.setState({ ...defaultPosition, ...defaultGlossInformation });
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

  render() {
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
        <h6>{this.state.word}</h6>
        <p>{this.state.description}</p>
        <p>
          {this.state.language} | {this.state.partOfSpeech}
        </p>
      </div>
    );
  }
  _getWordInformation = element => {
    const contentKey = element.getAttribute("data-gloss");

    const info = glossData[contentKey] || defaultGlossInformation;

    return {
      word: info.word,
      description: info.description,
      language: info.language,
      partOfSpeech: info.partOfSpeech
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
