import React from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from "./pages/Home";
import PageTwo from "./pages/PageTwo";

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

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
          <div className="language-controls float-right">
            <button
              className="btn btn-primary mr-2"
              onClick={() => changeLanguage("mi")}
            >
              Māori
            </button>
            <button
              className="btn btn-primary"
              onClick={() => changeLanguage("en")}
            >
              English
            </button>
          </div>
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
