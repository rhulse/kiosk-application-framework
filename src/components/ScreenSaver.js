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
    fadeDuration: 620
  };

  /**
   * Initial component state
   * @type {Object}
   * @private
   */
  state = {
    show: false
  };

  render() {
    const { children, fadeDuration } = this.props;
    const { show } = this.state;

    const content = children ? React.cloneElement(children) : "Screen Saver";

    return (
      <Transition
        config={{ duration: fadeDuration }}
        items={show}
        from={{ ...styles, opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {show => show && (props => <div style={props}>{content}</div>)}
      </Transition>
    );
  }

  start = () => {
    this.setState({ show: true });
  };

  stop = () => {
    this.setState({ show: false });
  };
}
