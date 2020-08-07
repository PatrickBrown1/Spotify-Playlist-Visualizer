import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import hash from "../hash";
import axios from 'axios';
export default class AboutPage extends Component {
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
      <div className="AboutPage">
        <h1>Welcome to the about page!</h1>
      </div>
    );
  }
}
