import React, { Component } from "react";
import { useLocation } from "react-router";
import { getAllSongs } from "../APIHandler.js";
export default class AnalysisPage extends Component {
  constructor() {
    super();
    this.state = {};
    //filtered list of playlists will be passed into props as
    //filteredPlaylists
    this.getAllSongs = getAllSongs.bind(this);
    this.createSongArray = this.createSongArray.bind(this);
    this.calculateMostPopularGenre = this.calculateMostPopularGenre.bind(this);
  }
  async componentDidMount() {
    //start all analysis functions here
    console.log("filteredPlaylists: ");
    console.log(this.props.filteredPlaylists);
    const allSongs = await this.createSongArray(this.props.filteredPlaylists);
    console.log(allSongs);
  }
  componentWillUnmount() {}
  async createSongArray(playlists) {
    /*
        This function will return an array of all of the songs in all of the playlists
        passed through this.props.filteredPlaylists. It has to do this by calling the
        api for each playlist, hence the use of the APIHandler.
    */
    //console.log("Inside createSongArray()");
    //console.log("playlists:");
    //console.log(playlists);
    var allSongsArray = [];
    var i;
    for(i = 0; i < playlists.length; i++){
      var playlist = playlists[i];
      //console.log("current playlist: ");
      //console.log(playlist);
      if(playlist.tracks != null){
        const callURL = playlist.tracks.href;
        //console.log("current call url: " + callURL);
        var currPlaylistSongs = await getAllSongs(this.props.token, callURL);
        
        allSongsArray = allSongsArray.concat(currPlaylistSongs);
      }
    }
    return allSongsArray;
  }
  calculateMostPopularGenre(songArray) {
    /*
        This function will calcualte the most popular genre given an array of songs
        I will create a dictionary with the keys being genres and the values being 
        arrays of songs. To calculate the most popular genre, I will simply find the
        key with the largest array. It will return an object containing the name of
        the genre (string), and the number of songs in the genre (int).
    */
    var genreDictionary = {};
    songArray.forEach((song) => {
      //grab the genre
    });
  }
  render() {
    console.log(this.props.filteredPlaylists);
    return <div>analysis</div>;
  }
}
