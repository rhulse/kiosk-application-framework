import React from "react";
import { BrowserRouter } from "react-router-dom";
import GlobalState from "./contexts/GlobalState";
import Kiosk from "./components/Kiosk";

function App() {
  return (
    <>
      <GlobalState>
        <BrowserRouter>
          <Kiosk />
        </BrowserRouter>
      </GlobalState>
    </>
  );
}

export default App;
