import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import hash from "../hash";
import axios from 'axios';
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
        <h1>Welcome to the home page!</h1>
      </div>
    );
  }
}