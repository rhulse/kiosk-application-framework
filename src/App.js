import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import config from "./configuration";

import Home from "./pages/Home";
import PageTwo from "./pages/PageTwo";
import LanguageControls from "./components/LanguageControls";

function App() {
  return (
    <div className="container">
      <Router>
        <header className="m-4">
          <Link className="btn btn-secondary mr-2" to="/">
            Home
          </Link>
          <Link className="btn btn-secondary" to="/page-two">
            Page Two
          </Link>
          <LanguageControls locales={config.i18n.locales} />
        </header>
        <main className="m-4">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/page-two" component={PageTwo} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
