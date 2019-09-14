import React from "react";
import { BrowserRouter } from "react-router-dom";
import GlobalState from "./contexts/GlobalState";
import EventTracker from "./contexts/EventTracker";
import Kiosk from "./components/Kiosk";

function App() {
  return (
    <>
      <GlobalState>
        <EventTracker>
          <BrowserRouter>
            <Kiosk />
          </BrowserRouter>
        </EventTracker>
      </GlobalState>
    </>
  );
}

export default App;
