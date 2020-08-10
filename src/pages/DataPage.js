import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import hash from "../hash";
import axios from 'axios';
import Card from "../Card.js"
import "./DataPage.css";
import { getUserInformation, getPlaylistNames} from "../APIHandler.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Button } from "antd";

export default class DataPage extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      user_info: {
        display_name: "",
        id: "",
      },
      no_user_data: true,
      no_playlist_data: true,
      playlists: null,
      number_playlists: 0,
    };
    this.getUserInformation = getUserInformation.bind(this);
    this.getPlaylistNames = getPlaylistNames.bind(this);
    this.removeNonOwnedPlaylists = this.removeNonOwnedPlaylists.bind(this);
    this.createPlaylistCards = this.createPlaylistCards.bind(this);
    //this.tick = this.tick.bind(this);
  }

  async componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });

      // --------------------------- Get User Information --------------------------- \\
      const userInfo = await getUserInformation(_token);
      console.log("fetched user information..." + userInfo);
      if(userInfo){
        this.setState({ user_info: userInfo.data, no_user_data: false });
      } else {
        this.setState({ no_user_data: true });
      }

      // --------------------------- Get Playlist Information ----------------------- \\
      console.log("Fetching playlist data");
      const playlists_data = await getPlaylistNames(_token);
      console.log("done fetching playlists");
      if(playlists_data.length != null){
        this.setState({
          playlists: playlists_data,
          number_playlists: playlists_data.length,
          no_playlist_data: false,
        });
      } else {
        this.setState({ playlists: [],
          number_playlists: 0,
          no_playlist_data: true,});
      }
      console.log(this.state.playlists);
    }
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }
  removeNonOwnedPlaylists() {
    var owned_playlists = [];
    for (var i = 0; i < this.state.playlists.length; i++) {
      if (this.state.playlists[i].owner.id === this.state.user_info.id) {
        owned_playlists.push(this.state.playlists[i]);
        //alert(this.state.playlists[i].name + " is not owned by " + this.state.user_info.display_name);
      }
    }
    this.setState({ playlists: owned_playlists });
  }
  createPlaylistCards(){
    //this method is only called from the render method
    //a precursor to the call is the existence of playlist data
    //therefore this method should always have playlist data to work with
    const cardList = this.state.playlists.map(playlistObj => (
      <Card playlistObject={playlistObj} />
    ));
    return cardList;
  }
  render() {
    return (
      <div>
        <header className="error-header">
          {!this.state.token && (
            <div>
              <h1>You dont seem to be logged in to Spotify</h1>
              <h3>Go back to the home page to log in</h3>
              <Link to="/">
                <Button type="primary">
                  Home
                </Button>
              </Link>
            </div>
          )}

          {this.state.token && !this.state.no_playlist_data && (
            <div className="data-page-main">
              <h1 className="header"> Hello, {this.state.user_info.display_name}</h1>
              <div className="card-container">
                {this.createPlaylistCards()}
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}

