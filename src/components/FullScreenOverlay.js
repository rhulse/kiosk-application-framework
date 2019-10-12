import React from "react";

import Icon, { close } from "./Icon";

const defaultStyles = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  backgroundColor: "black",
  zIndex: "1",
  visibility: "hidden"
};

export default function FullScreenOverlayContainer({
  children,
  show,
  className,
  onClose
}) {
  let styles = defaultStyles;

  if (show) {
    styles = { ...defaultStyles, visibility: "visible" };
  } else {
    styles = { ...defaultStyles, visibility: "hidden" };
  }

  return (
    <div style={{ ...styles }} className={className}>
      <Icon
        className="close-overlay"
        icon={close}
        onClick={onClose}
        style={{ color: "white" }}
      />
      {children}
    </div>
  );
}
