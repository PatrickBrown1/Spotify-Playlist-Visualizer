import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import hash from "../hash";
import axios from 'axios';
import "./HomePage.css";
import { Button } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
export default class HomePage extends Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    // Set token
  }

  componentWillUnmount() {

  }
  render() {
    return (
      <div className="HomePage">
        <div className="background"></div>
        <h1 className="title-header">Playlist Analyzer</h1>
        <h2 className="subtitle-header">Discover your music</h2>
        {!this.props.auth_token && (
            <Button type="primary" href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`} >
              Login to Spotify
            </Button>
        )}
        {this.props.auth_token && (
          <Link to="/data">
            <Button type="primary">
              Explore
            </Button>
          </Link>
        )}
      </div>
    );
  }
}