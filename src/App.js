import React from "react";
import GlobalState from "./contexts/GlobalState";
import Kiosk from "./components/Kiosk";

function App() {
  return (
    <>
      <GlobalState>
        <Kiosk />
      </GlobalState>
    </>
  );
}

export default App;
