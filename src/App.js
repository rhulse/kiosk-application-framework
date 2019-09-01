import React from "react";
import { BrowserRouter } from "react-router-dom";
import GlobalState from "./contexts/GlobalState";

import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  return (
    <div className="container">
      <GlobalState>
        <BrowserRouter>
          <Header />
          <Main />
        </BrowserRouter>
      </GlobalState>
    </div>
  );
}

export default App;
