import IdleTimer from "react-idle-timer";

export default IdleTimer;

const MEDIA_IS_PLAYING = "mediaIsPlaying";

const mediaIsPlayingEvent = new Event(MEDIA_IS_PLAYING);

export const emitPlayingEvent = () => {
  document.dispatchEvent(mediaIsPlayingEvent);
};

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
