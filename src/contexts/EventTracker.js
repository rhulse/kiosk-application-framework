import React, { createContext } from "react";
import { Analytics } from "../analytics/Analytics";

export const TrackerContext = createContext();

const analytics = new Analytics();

const EventTracker = props => {
  return (
    <TrackerContext.Provider value={{ analytics }}>
      {props.children}
    </TrackerContext.Provider>
  );
};

export default EventTracker;
