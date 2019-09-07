import React, { Component } from "react";
import glossData from "../glossData.json";

const defaultPosition = {
  position: "absolute",
  left: "-9990px",
  top: "-9990px"
};

const defaultGlossInformation = {
  word: "Unknown Word",
  description: "No Data for Word"
};

const downEventTypes = ["mousedown", "touchdown"];

export default class Gloss extends Component {
  state = { ...defaultPosition, ...defaultGlossInformation };

  show = event => {
    event.preventDefault();

    const glossedElement = event.target;

    const wordInformation = this._getWordInformation(glossedElement);

    const glossXY = this._calculateGlossXY(glossedElement);

    this._addCheckForExternalClicks();

    this.setState({
      ...glossXY,
      ...wordInformation
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
        <h3>{this.state.word}</h3>
        <p>{this.state.description}</p>
      </div>
    );
  }
  _getWordInformation = element => {
    const contentKey = element.getAttribute("data-gloss");

    const info = glossData[contentKey] || defaultGlossInformation;

    return {
      word: info.word,
      description: info.description
    };
  };

  _calculateGlossXY = element => {
    const bounds = element.getBoundingClientRect();

    const newLeft = bounds.left + bounds.width / 2;
    const newTop = bounds.top + 50;

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
