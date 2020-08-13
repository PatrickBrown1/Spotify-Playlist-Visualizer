import React, { Component } from "react";
import { useLocation } from "react-router";
import { getAllSongs } from "../APIHandler.js";
import { VictoryPie } from "victory";

export default class AnalysisPage extends Component {
  constructor() {
    super();
    this.state = {};
    //filtered list of playlists will be passed into props as
    //filteredPlaylists
    this.getAllSongs = getAllSongs.bind(this);
    this.createSongArray = this.createSongArray.bind(this);
    this.calculateMostPopularGenre = this.calculateMostPopularGenre.bind(this);
    this.createArtistToSongMap = this.createArtistToSongMap.bind(this);
    this.popularArtistPieChart = this.popularArtistPieChart.bind(this);
  }
  async componentDidMount() {
    //start all analysis functions here
    const allSongs = await this.createSongArray(this.props.filteredPlaylists);
    this.setState({artistToSongMap: this.createArtistToSongMap(allSongs)});
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
  createArtistToSongMap(songArray){
    var artistDictionary = {};
    var i = 0;
    songArray.forEach((song) => {
      //grab the genre
      if(song === null){
        console.log("Null Song @ " + i);
      }
      else{
        var artistsList = song.artists; //list of artists on current song
        
        //iterate through each artist, adding this song to their array
        artistsList.forEach((artistObject) => {
          //if the artist doesnt exist already, add them to the dictionary
          if(artistDictionary[artistObject.name] === undefined){
            //console.log("First time artist, " + artistObject.name);
            artistDictionary[artistObject.name] = [song];
          }
          //else, the artist already exists. Pop the array, add the new song, update
          //the dictionary
          else{
            var artistSongArray = artistDictionary[artistObject.name];
            if(!artistSongArray.some(e => e.id === song.id)){
              //no element in artistSongArray has the same id as the current song
              artistSongArray.push(song);
              artistDictionary[artistObject.name] = artistSongArray;
            }
            else{
              //console.log(song.name + " tried to add twice");
            }
          }
        });
      }
      i++;
    });
    console.log(artistDictionary);
    return artistDictionary;
  }
  popularArtistPieChart(){
    var data = [];
    var artistToSongMapVar = this.state.artistToSongMap;
    console.log(artistToSongMapVar);
    
    Object.keys(artistToSongMapVar).forEach(function (item) {
      data.push({x: item, y: artistToSongMapVar[item].length});
    });
    return (
      <div>
        <VictoryPie 
          data={data}
        />
      </div>
    );
  }
  calculateMostPopularGenre(songArray) {
    /*
        This function will calcualte the most popular genre given an array of songs
        I will create a dictionary with the keys being genres and the values being 
        arrays of songs. To calculate the most popular genre, I will simply find the
        key with the largest array. It will return an object containing the name of
        the genre (string), and the number of songs in the genre (int).
    */
    /* 
      Uh oh, the song doesn't have a genre specification, only the artist does.
      I need to access the api for every artist, can get 50 artists per api call.
      I can iterate through the songs, then create a dictionary with artist id as
      the key and an array of their songs as the value. This could be useful for the
      most popular artist tab as well.
    */
    var genreDictionary = {};
    songArray.forEach((song) => {
      //grab the genre
      console.log(song.name);
    });
  }
  render() {
    return (
      <div>
        analysis
        {this.state.artistToSongMap !== undefined && (
          <div>
            {this.popularArtistPieChart()}
          </div>
        )}
      </div>
    );
  }
}
