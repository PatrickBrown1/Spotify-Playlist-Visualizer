import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import axios from "axios";
import hash from "./hash";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage.js";
import DataPage from "./pages/DataPage.js";
import AboutPage from "./pages/AboutPage.js";
import AnalysisPage from "./pages/AnalysisPage.js";


class App extends Component {
  constructor() {
    super();
    this.state = {
      auth_token: null,
    };
    //If token is null then the user has not logged in
  }

  async componentDidMount() {
    let _token = hash.access_token;
    this.setState({ auth_token: _token });
  }

  componentWillUnmount() {}

  render() {
    return (
        <Router>
          <div className="App">
            <body>
              <Switch>
                <Route path="/about">
                  <AboutPage />
                </Route>
                <Route path="/data">
                  <DataPage auth_token={this.state.auth_token} />
                </Route>
                <Route path="/">
                  <HomePage auth_token={this.state.auth_token} />
                </Route>
              </Switch>
            </body>
          </div>
        </Router>
    );
  }
}

export default App;
