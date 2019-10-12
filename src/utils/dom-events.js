import { useEffect } from "react";
import useEventListener from "@use-it/event-listener";

export const MEDIA_IS_PLAYING = "mediaIsPlaying";
export const STOP_MEDIA_EVENT = "stopMediaPlaying";

const mediaIsPlayingEvent = new Event(MEDIA_IS_PLAYING);
const stopMediaPlayingEvent = new Event(STOP_MEDIA_EVENT);

/**
 * media players should emit this event at regular intervals to stop the screensaver starting
 *
 * @param none
 */
export const dispatchPlayingEvent = () => {
  document.dispatchEvent(mediaIsPlayingEvent);
};

/**
 *  media players should listen for this event using the hook or functions below
 *  this event is only sent on a user action - media will time out if no other user action follows
 *
 * @param none
 */
export const dispatchStopMediaEvent = () => {
  document.dispatchEvent(stopMediaPlayingEvent);
};

/**
 * Listens for the stop media event, and calls the supplied function.
 *
 * @param {Function} callback - the function to call
 */
export function useStopMediaEventListener(callback) {
  useEventListener(STOP_MEDIA_EVENT, callback, document);
}

/**
 * Attaches (and removes) a function to call when a gloss is clicked.
 *
 * @param {Element} containerElement - where to look for gloss elements
 * @returns {Array}  The gloss elements
 */
function fetchGlossElements(containerElement) {
  return containerElement.querySelectorAll("[data-gloss]");
}

/**
 * Attaches (and removes) a function to call when a gloss is clicked.
 *
 * @param {any}       watched - the value to watch for change (usually language)
 * @param {function}  callback - the function to call on click
 */
export function useGlossClickListeners(watched, callback) {
  useEffect(() => {
    const glossElements = fetchGlossElements(document);

    glossElements.forEach(glossElement => {
      glossElement.addEventListener("click", callback);
    });
    return () => {
      glossElements.forEach(glossElement => {
        glossElement.removeEventListener("click", callback);
      });
    };
  }, [watched, callback]);
}
