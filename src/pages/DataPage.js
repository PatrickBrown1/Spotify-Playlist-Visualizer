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
      numSelectedPlaylists: 0,
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
    this.selectOwnedPlaylists = this.selectOwnedPlaylists.bind(this);
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
        playlists_data.forEach((playlist) => (playlist.toBeUsed = false));
        this.setState({
          playlists: playlists_data,
          number_playlists: playlists_data.length,
          numSelectedPlaylists: 0,
          no_playlist_data: false,
        });
      } else {
        this.setState({
          playlists: [],
          number_playlists: 0,
          numSelectedPlaylists: 0,
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
    var numSelectedDelta = 0;
    tempPlaylists.forEach((playlist) => {
      if (playlist.id === id) {
        //flip clicked boolean
        if(playlist.toBeUsed === true){
          //deselect playlist, decrement number of selected playlists
          numSelectedDelta = -1;
        }
        else{
          //select playlist, increment number of selected playlists
          numSelectedDelta = 1;
        }
        playlist.toBeUsed = !playlist.toBeUsed;
      }
    });
    this.setState( (prevState) => { 
      return{
        playlists: tempPlaylists, 
        numSelectedPlaylists: prevState.numSelectedPlaylists + numSelectedDelta,
      }
    });
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
    this.setState({ playlists: tempPlaylists, numSelectedPlaylists: tempPlaylists.length });
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
    this.setState({ playlists: tempPlaylists, numSelectedPlaylists: 0 });
  }
  selectOwnedPlaylists(){
    var tempPlaylists = this.state.playlists;
    var playlistsIncluded = 0;
    //iterate through all non-owned playlists, set toBeUsed to false
    tempPlaylists.forEach((playlist) => {
      if(playlist.owner.id !== this.state.user_info.id){
        playlist.toBeUsed = false;
      }
      else{
        playlist.toBeUsed = true;
        playlistsIncluded++;
      }
    });
    //set state to new playlist array
    this.setState({ playlists: tempPlaylists, numSelectedPlaylists: playlistsIncluded });
  }
  handleGoClick(){
    this.setState({showAnalysis: true});
  }
  //Iterates through all playlists, returns array of playlists that have been selected
  filterPlaylists(){
    var filteredArray = [];
    this.state.playlists.forEach(playlist => {
      if(playlist.toBeUsed == true){
        filteredArray.push(playlist);
      }
    });
    return filteredArray;
  }
  render() {
    const numSelectedPlaylists = this.state.numSelectedPlaylists;
    const numTotalPlaylists = this.state.number_playlists;
    var cardList = null;
    if (!this.state.no_playlist_data) {
      cardList = this.createPlaylistCards();
    }
    //console.log("rendering datapage");
    return (
      <div className="data-page-main">
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
          <div>
            <div className="above-playlist-container"> 
              <h1>Pick some Playlists to Analyze</h1>
            </div>
            <div className="data-body">
              <div className="sorting-button-container">
                <h3>Filter Playlists</h3>
                <Button className="filter-buttons" type="primary" onClick={() => this.selectAllPlaylists()}>Select All</Button>
                <Button className="filter-buttons" type="primary" onClick={() => this.deselectAllPlaylists()}>Remove All</Button>
                <Button className="filter-buttons" type="primary" onClick={() => this.selectOwnedPlaylists()}>Owned by Me</Button>
                <div style={{marginTop: "auto"}}></div>
                <h4>{numSelectedPlaylists} Playlists Selected</h4>
                <h4>{numTotalPlaylists} Playlists Total</h4>
              </div>
              <div className="card-container">{cardList}</div>
            </div>
            
            <div className="footer">
              <Button className="footer-button" type="primary" onClick={() => this.handleGoClick()}>Go</Button>
            </div>
          </div>
        )}
        {this.state.showAnalysis && this.state.token && (
          <AnalysisPage filteredPlaylists={this.filterPlaylists()} token={this.state.token}/>
        )}
      </div>
    );
  }
}
