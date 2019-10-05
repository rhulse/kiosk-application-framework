import IdleTimer from "react-idle-timer";

import { MEDIA_IS_PLAYING } from "../utils/dom-events";

export const ACTIVE_EVENTS = [
  "mousemove",
  "keydown",
  "wheel",
  "DOMMouseScroll",
  "mouseWheel",
  "mousedown",
  "touchstart",
  "touchmove",
  "MSPointerDown",
  "MSPointerMove",
  MEDIA_IS_PLAYING
];

export default IdleTimer;
