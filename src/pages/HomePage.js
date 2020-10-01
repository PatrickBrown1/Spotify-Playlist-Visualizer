import React, { Component } from "react";
import hash from "../hash";
import axios from "axios";
import "./HomePage.css";
import { Button } from "antd";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { authEndpoint, clientId, redirectUri, scopes } from "../config.js";

import RecordSVG from "../vinyl-record-svgrepo-com.svg";
export default class HomePage extends Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    // Set token
  }

  componentWillUnmount() {}
  render() {
    return (
      <div class="grid-container">
        <div class="item white-bg"></div>
        <div class="item white-bg"></div>
        <div class="item white-bg right-border"></div>
        <div class="item navy-bg left-border"></div>
        <div class="item navy-bg"></div>
        <div class="item white-bg"></div>
        <div class="item white-bg">
          <div>
            <h1 class="title-header">Playlist Analyzer</h1>
          </div>
          <div>
            <h2 class="subtitle-header">Discover your music</h2>
          </div>
        </div>
        <div class="circle-item">
          <div id="record-container">
            <img
              id="record"
              src={RecordSVG}
              alt="record"
              height="90%"
              width="90%"
            />
          </div>
        </div>
        <div class="item navy-bg"></div>
        <div class="item white-bg"></div>
        <div class="item white-bg">
          {!this.props.auth_token && (
            <Button
              type="primary"
              className="main-button"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </Button>
          )}
          {this.props.auth_token && (
            <Link to="/data">
              <Button type="primary" className="main-button">
                Explore
              </Button>
            </Link>
          )}
        </div>
        <div class="item navy-bg"></div>
        <div class="item white-bg"></div>
        <div class="item white-bg"></div>
        <div class="item white-bg right-border"></div>
        <div class="item navy-bg left-border"></div>
        <div class="item navy-bg"></div>
      </div>
    );
  }
}
