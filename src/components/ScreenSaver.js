/** *
 * @name ScreenSaver
 * @author Richard Hulse
 * @private
 */

import React, { Component } from "react";

const styles = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(100, 100, 150, 1.92)",
  fontSize: 32,
  color: "white"
};

export default class ScreenSaver extends Component {
  /**
   * Default property values
   * @type {Object}
   * @private
   */
  static defaultProps = {
    fadeDuration: 20
  };

  /**
   * Initial component state
   * @type {Object}
   * @private
   */
  state = {
    running: false,
    opacity: 0,
    width: 0,
    height: 0
  };

  render() {
    const { children } = this.props;
    const { opacity, width, height } = this.state;

    if (children !== undefined) {
      return React.cloneElement(children, {
        style: { opacity, width, height }
      });
    } else {
      return (
        <div style={{ ...styles, opacity, width, height }}>Screen Saver</div>
      );
    }
  }

  start = () => {
    this.setState({ running: true });
    this._fadeIn();
  };

  stop = () => {
    this._fadeOut();
    this.setState({ running: false });
  };

  _zoomUp = () => {
    this.setState({ width: "100%", height: "100%" });
  };

  _zoomDown = () => {
    this.setState({ width: 0, height: 0 });
  };

  _fadeOut = () => {
    const { fadeDuration } = this.props;
    let { opacity } = this.state;

    var timer = setInterval(() => {
      if (opacity <= 0.1) {
        this.setState({ opacity: 0 });
        this._zoomDown(); // done
        clearInterval(timer);
      } else {
        opacity -= opacity * 0.1;
        this.setState({ opacity });
      }
    }, fadeDuration);
  };

  _fadeIn = () => {
    const { fadeDuration } = this.props;
    let { opacity } = this.state;

    this._zoomUp(); // start
    var timer = setInterval(() => {
      if (opacity >= 1) {
        this.setState({ opacity: 1 });
        clearInterval(timer);
      } else {
        if (opacity === 0) {
          opacity = 0.1;
        }
        opacity += opacity * 0.1;
        this.setState({ opacity });
      }
    }, fadeDuration);
  };
}
