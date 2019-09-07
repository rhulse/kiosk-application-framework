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

export default class Gloss extends Component {
  state = { ...defaultPosition, ...defaultGlossInformation };

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

  show = event => {
    event.preventDefault();

    const glossedElement = event.target;

    const wordInformation = this._getWordInformation(glossedElement);

    const glossXY = this._calculateGlossXY(glossedElement);

    this.setState({
      ...glossXY,
      ...wordInformation
    });
  };

  hide = event => {
    // called by screen saver, so no event...
    event && event.preventDefault();

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
    const top = this.state.top;
    const left = this.state.left;

    return { ...defaultPosition, top: top, left: left };
  };

  render() {
    return (
      <div style={this.styles()} className="gloss">
        <span onClick={this.hide} className="gloss-close">
          X
        </span>
        <h3>{this.state.word}</h3>
        <p>{this.state.description}</p>
      </div>
    );
  }

  _fetchGlossElements(containerElement) {
    return containerElement.querySelectorAll("[data-gloss]");
  }
}
