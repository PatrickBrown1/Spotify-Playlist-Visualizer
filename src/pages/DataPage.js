import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import hash from "../hash";
import axios from "axios";
import PlaylistCard from "../PlaylistCard.js";
import "./DataPage.css";
import { getUserInformation, getPlaylistNames } from "../APIHandler.js";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button } from "antd";
import AnalysisPage from "./AnalysisPage.js";

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
      showAnalysis: false,
    };
    this.getUserInformation = getUserInformation.bind(this);
    this.getPlaylistNames = getPlaylistNames.bind(this);
    this.removeNonOwnedPlaylists = this.removeNonOwnedPlaylists.bind(this);
    this.createPlaylistCards = this.createPlaylistCards.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.selectAllPlaylists = this.selectAllPlaylists.bind(this);
    this.deselectAllPlaylists = this.deselectAllPlaylists.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
    this.filterPlaylists = this.filterPlaylists.bind(this);
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
      if (userInfo) {
        this.setState({ user_info: userInfo.data, no_user_data: false });
      } else {
        this.setState({ no_user_data: true });
      }

      // --------------------------- Get Playlist Information ----------------------- \\
      console.log("Fetching playlist data");
      const playlists_data = await getPlaylistNames(_token);
      console.log("done fetching playlists");
      if (playlists_data.length != null) {
        //add clicked field to each object, default as true
        playlists_data.forEach((playlist) => (playlist.toBeUsed = true));
        this.setState({
          playlists: playlists_data,
          number_playlists: playlists_data.length,
          no_playlist_data: false,
        });
      } else {
        this.setState({
          playlists: [],
          number_playlists: 0,
          no_playlist_data: true,
        });
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
  createPlaylistCards() {
    //this method is only called from the render method
    //a precursor to the call is the existence of playlist data
    //therefore this method should always have playlist data to work with
    const cardList = this.state.playlists.map((playlistObj) => (
      <PlaylistCard
        playlistObject={playlistObj}
        toBeUsed={playlistObj.toBeUsed}
        handleCardClick={this.handleCardClick}
      />
    ));
    return cardList;
  }
  handleCardClick(id) {
    //find playlist with the correct id
    var tempPlaylists = this.state.playlists;
    tempPlaylists.forEach((playlist) => {
      if (playlist.id === id) {
        //flip clicked boolean

        //console.log("Playlist with id " + id + " was " + playlist.toBeUsed);
        playlist.toBeUsed = !playlist.toBeUsed;
        //console.log("Playlist with id " + id + " is now " + playlist.toBeUsed);
      }
    });
    this.setState({ playlists: tempPlaylists });
  }

  //The following two functions are only called if the playlist data is not null
  //based on the conditional rendering in the render function
  selectAllPlaylists() {
    //get playlist array from state and put into temp array
    var tempPlaylists = this.state.playlists;
    //iterate through all playlists set toBeUsed to true
    tempPlaylists.forEach((playlist) => {
      playlist.toBeUsed = true;
    });
    //set state to new playlist array
    this.setState({ playlists: tempPlaylists });
  }
  deselectAllPlaylists() {
    //get playlist array from state and put into temp array
    var tempPlaylists = this.state.playlists;
    console.log(tempPlaylists);
    //iterate through all playlists set toBeUsed to false
    tempPlaylists.forEach((playlist) => {
      playlist.toBeUsed = false;
    });
    //set state to new playlist array
    this.setState({ playlists: tempPlaylists });
  }
  handleGoClick(){
    this.setState({showAnalysis: true});
  }
  filterPlaylists(){
    return [];
  }
  render() {
    var cardList = null;
    if (!this.state.no_playlist_data) {
      cardList = this.createPlaylistCards();
    }
    //console.log("rendering datapage");
    return (
      <div>
        {!this.state.token && (
          <div className="error-header">
              <div>
                <h1>You dont seem to be logged in to Spotify</h1>
                <h3>Go back to the home page to log in</h3>
                <Link to="/">
                  <Button type="primary">Home</Button>
                </Link>
              </div>
            
          </div>
        )}
        {this.state.token && !this.state.no_playlist_data && !this.state.showAnalysis && (
          <div className="data-page-main">
            <div className="header">
              <h2> Hello, {this.state.user_info.display_name}</h2>
              <h3> Here are your playlists</h3>
            </div>
            <div className="above-playlist-container">
              <Button className="filter-buttons" type="primary" onClick={() => this.selectAllPlaylists()}>Select All</Button>
              <Button className="filter-buttons" type="primary" onClick={() => this.deselectAllPlaylists()}>Remove All</Button>
              <h5 className="playlist-number">Total Playlists: {this.state.number_playlists}</h5>
            </div>
            <div className="card-container">{cardList}</div>
            <div className="footer">
              <Button className="footer-button" type="primary" onClick={() => this.handleGoClick()}>Go</Button>
            </div>
          </div>
        )}
        {this.state.showAnalysis && this.state.token && (
          <div className="data-page-main">
            <AnalysisPage filteredPlaylists={this.filterPlaylists()}/>
          </div>
        )}
      </div>
    );
  }
}
