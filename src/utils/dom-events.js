import useEventListener from "@use-it/event-listener";

export const MEDIA_IS_PLAYING = "mediaIsPlaying";
export const STOP_MEDIA_EVENT = "stopMediaPlaying";

const mediaIsPlayingEvent = new Event(MEDIA_IS_PLAYING);
const stopMediaPlayingEvent = new Event(STOP_MEDIA_EVENT);

// playing events are emitted by media players in order
// to stop the screensaver starting
export const dispatchPlayingEvent = () => {
  document.dispatchEvent(mediaIsPlayingEvent);
};

export const dispatchStopMediaEvent = () => {
  document.dispatchEvent(stopMediaPlayingEvent);
};

export function useStopMediaEventListener(callback) {
  useEventListener(STOP_MEDIA_EVENT, callback, document);
}

export function addStopMediaEventListener(callback) {
  document.addEventListener(STOP_MEDIA_EVENT, callback);
}
export function removeStopMediaEventListener(callback) {
  document.removeEventListener(STOP_MEDIA_EVENT, callback);
}
