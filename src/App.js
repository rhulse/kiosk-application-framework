import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GlossProvider } from "./contexts/GlossContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { VideoProvider } from "./contexts/VideoContext";
import EventTracker from "./contexts/EventTracker";
import Kiosk from "./components/Kiosk";

function App() {
  return (
    <>
      <VideoProvider>
        <GlossProvider>
          <LanguageProvider>
            <EventTracker>
              <BrowserRouter>
                <Kiosk />
              </BrowserRouter>
            </EventTracker>
          </LanguageProvider>
        </GlossProvider>
      </VideoProvider>
    </>
  );
}

export default App;
