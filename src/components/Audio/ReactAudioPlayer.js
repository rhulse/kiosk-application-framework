// Based on code from https://github.com/justinmc/react-audio-player
// https://github.com/justinmc/react-audio-player/blob/master/LICENSE

import React, { Component } from "react";
import PropTypes from "prop-types";

const audioEvents = [
  "Abort",
  "CanPlay",
  "CanPlayThrough",
  "DurationChange",
  "Emptied",
  "Ended",
  "Error",
  "LoadedData",
  "LoadedMetadata",
  "LoadStart",
  "Pause",
  "Play",
  "Playing",
  "Progress",
  "RateChange",
  "Seeked",
  "Seeking",
  "Stalled",
  "Suspend",
  "TimeUpdate",
  "VolumeChange",
  "Waiting"
];

export default class ReactAudioPlayer extends Component {
  componentDidMount() {
    audioEvents.forEach(event => {
      this.audioEl.addEventListener(event.toLocaleLowerCase(), e => {
        this.props[`on${event}`](e);
      });
    });

    this.updateVolume(this.props.volume);
  }

  componentWillUnmount() {
    audioEvents.forEach(event => {
      this.audioEl.removeEventListener(event.toLocaleLowerCase(), e => {
        this.props[`on${event}`](e);
      });
    });
  }

  /**
   * Set the volume on the audio element from props
   * @param {Number} volume
   */
  updateVolume = volume => {
    if (typeof volume === "number" && volume !== this.audioEl.volume) {
      this.audioEl.volume = volume;
    }
  };

  play = () => {
    this.audioEl.play();
  };

  pause = () => {
    this.audioEl.pause();
  };

  render() {
    // Set controls to be true by default unless explicity stated otherwise
    const controls = !(this.props.controls === false);

    // Set lockscreen / process audio title on devices
    const title = this.props.title ? this.props.title : this.props.src;

    // Some props should only be added if specified
    const conditionalProps = {};
    if (this.props.controlsList) {
      conditionalProps.controlsList = this.props.controlsList;
    }

    return (
      <audio
        autoPlay={this.props.autoPlay}
        className={`react-audio-player ${this.props.className}`}
        controls={controls}
        crossOrigin={this.props.crossOrigin}
        id={this.props.id}
        loop={this.props.loop}
        muted={this.props.muted}
        preload={this.props.preload}
        ref={ref => {
          this.audioEl = ref;
        }}
        src={this.props.src}
        style={this.props.style}
        title={title}
        {...conditionalProps}
      />
    );
  }
}

const defaultPropFunctions = {};
const propTypeFunctions = {};

audioEvents.forEach(fn => {
  const eventName = `on${fn}`;
  defaultPropFunctions[eventName] = function() {};
  propTypeFunctions[eventName] = PropTypes.func;
});

ReactAudioPlayer.defaultProps = {
  autoPlay: false,
  children: null,
  className: "",
  controls: false,
  controlsList: "",
  crossOrigin: null,
  id: "",
  loop: false,
  muted: false,
  preload: "metadata",
  src: null,
  style: {},
  title: "",
  volume: 1.0,
  ...defaultPropFunctions
};

ReactAudioPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  controls: PropTypes.bool,
  controlsList: PropTypes.string,
  crossOrigin: PropTypes.string,
  id: PropTypes.string,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  preload: PropTypes.oneOf(["", "none", "metadata", "auto"]),
  src: PropTypes.string, // Not required b/c can use <source>
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  volume: PropTypes.number,
  ...propTypeFunctions
};
