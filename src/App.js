import React, { useRef, useCallback } from "react";
import IdleTimer from "react-idle-timer";
import GlobalState from "./contexts/GlobalState";

import ScreenSaver from "./components/ScreenSaver";
import config from "./configuration";
import Kiosk from "./components/Kiosk";

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
      <GlobalState>
        <Kiosk />
      </GlobalState>
    </>
  );
}

export default App;
