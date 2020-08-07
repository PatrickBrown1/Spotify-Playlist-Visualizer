import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import HomePage from "./pages/HomePage.js";
import DataPage from "./pages/DataPage.js";
import AboutPage from "./pages/AboutPage.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      
    };
    
  }

  async componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }
  
  
  render() {
    return (
      <div>
        <Router>
          <div className="App">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/data">Data</Link>
                </li>
              </ul>
            </nav>
            <Switch>
              <Route path="/about">
                <AboutPage />
              </Route>
              <Route path="/data">
                <DataPage />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
