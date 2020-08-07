import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import hash from "../hash";
import axios from 'axios';
import "./HomePage.css";
export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
    };
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
      </div>
    );
  }
}