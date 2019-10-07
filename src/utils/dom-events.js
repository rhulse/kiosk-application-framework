import useEventListener from "@use-it/event-listener";

export const MEDIA_IS_PLAYING = "mediaIsPlaying";
export const STOP_MEDIA_EVENT = "stopMediaPlaying";

const mediaIsPlayingEvent = new Event(MEDIA_IS_PLAYING);
const stopMediaPlayingEvent = new Event(STOP_MEDIA_EVENT);

// media players should emit this event at regular intervals to stop the screensaver starting
export const dispatchPlayingEvent = () => {
  document.dispatchEvent(mediaIsPlayingEvent);
};

// media players should listen for this event using the hook or functions below
// this event is only sent on a user action - media will time out if no other user action follows
export const dispatchStopMediaEvent = () => {
  document.dispatchEvent(stopMediaPlayingEvent);
};

// use in functional components
export function useStopMediaEventListener(callback) {
  useEventListener(STOP_MEDIA_EVENT, callback, document);
}

// use in class components
export function addStopMediaEventListener(callback) {
  document.addEventListener(STOP_MEDIA_EVENT, callback);
}
export function removeStopMediaEventListener(callback) {
  document.removeEventListener(STOP_MEDIA_EVENT, callback);
}
