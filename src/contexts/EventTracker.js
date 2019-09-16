import React, { createContext } from "react";
import { analytics } from "../analytics/Analytics";

export const TrackerContext = createContext();

const EventTracker = props => {
  return (
    <TrackerContext.Provider value={{ analytics }}>
      {props.children}
    </TrackerContext.Provider>
  );
};

export default EventTracker;
