import React, { useRef, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import IdleTimer from "react-idle-timer";

import GlobalState from "./contexts/GlobalState";
import ScreenSaver from "./components/ScreenSaver";
import config from "./configuration";

import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  const idleTimer = useRef(null);
  const screenSaver = useRef(null);

  const appIsActive = useCallback(() => {
    screenSaver.current.stop();
  }, []);

  const appIsIdle = useCallback(() => {
    screenSaver.current.start();
  }, []);

  return (
    <>
      <ScreenSaver ref={screenSaver} />
      <IdleTimer
        ref={idleTimer}
        onActive={appIsActive}
        onIdle={appIsIdle}
        debounce={250}
        timeout={config.screensaver.seconds_timeout_to_start}
        startOnLoad
      />
      <div className="container">
        <GlobalState>
          <BrowserRouter>
            <Header />
            <Main />
          </BrowserRouter>
        </GlobalState>
      </div>
    </>
  );
}

export default App;
