/** *
 * @name ScreenSaver
 * @author Richard Hulse
 * @private
 */

import React, { Component } from "react";
import { Transition } from "react-spring/renderprops";

const styles = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(100, 100, 150, 1)",
  fontSize: 32,
  color: "white",
  "z-index": "3141592653"
};

export default class ScreenSaver extends Component {
  /**
   * Default property values
   * @type {Object}
   * @private
   */
  static defaultProps = {
    attractorFadeDuration: 0.675,
    attractorShowDuration: 5,
    attractorHideDuration: 0
  };

  /**
   * Initial component state
   * @type {Object}
   * @private
   */
  state = {
    showAttractor: false,
    saverRunning: false
  };

  render() {
    const { children, attractorFadeDuration } = this.props;
    const { showAttractor } = this.state;

    const content = children ? React.cloneElement(children) : "Screen Saver";

    return (
      <Transition
        config={{ duration: attractorFadeDuration * 1000 }}
        items={showAttractor}
        from={{ ...styles, opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {showAttractor =>
          showAttractor && (props => <div style={props}>{content}</div>)
        }
      </Transition>
    );
  }

  start = () => {
    this.setState({ saverRunning: true });
    if (this.props.attractorHideDuration > 0) {
      this.hideTimer();
    } else {
      this.setState({ showAttractor: true });
    }
  };

  stop = () => {
    clearInterval(this.hideTimerID);
    clearInterval(this.showTimerID);
    this.setState({ saverRunning: false, showAttractor: false });
  };

  hideTimer = () => {
    this.hideTimerID = setTimeout(() => {
      this.setState({ showAttractor: true });
      this.showTimer();
    }, this.props.attractorHideDuration * 1000);
  };

  showTimer = () => {
    this.showTimerID = setTimeout(() => {
      this.setState({ showAttractor: false });
      this.hideTimer();
    }, this.props.attractorShowDuration * 1000);
  };
}
