import React, { Component } from "react";
import { useLocation } from "react-router";
import { getAllSongs, getSongObjects } from "../APIHandler.js";
import { VictoryPie, VictoryLegend } from "victory";
import "./AnalysisPage.css";
import SongGraph from "../SongGraph.js"
import ArtistPieGraph from "../ArtistPieGraph.js"
import _ from "lodash";
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import SongTable from "../SongTable.js"
import BarLoader from "react-spinners/BarLoader";

export default class AnalysisPage extends Component {
  constructor() {
    super();
    this.state = {
      width: 0,
      height: 0
    };
    //filtered list of playlists will be passed into props as
    //filteredPlaylists
    this.getAllSongs = getAllSongs.bind(this);
    this.getSongObjects = getSongObjects.bind(this);
    this.createSongArray = this.createSongArray.bind(this);
    this.calculateMostPopularGenre = this.calculateMostPopularGenre.bind(this);
    this.createArtistToSongMap = this.createArtistToSongMap.bind(this);
    this.createAnalysisArray = this.createAnalysisArray.bind(this);
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
    this.renderTab = this.renderTab.bind(this);
    this.renderPopularArtistTab = this.renderPopularArtistTab.bind(this);
    this.renderSongScatterTab = this.renderSongScatterTab.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.renderSongChart = this.renderSongChart.bind(this);
  }
  componentWillMount (){
    this.setState({loading: true});
  }
  async componentDidMount() {
    //Progression of API Calls / Filtering of this function
    //1. (API CALL) get an array of all songs in the playlists selected
    //  1a. remove all duplicates from these songs (done with lodash library)
    //2. (API CALL) get an array of the "music analysis" of all of the
    //   songs in the playlists selected
    //3. Pair/Add these music analysis objects to the song object from 1.
    //4. Create the artist to song map, set state.

    //1
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    var allSongs = await this.createSongArray(this.props.filteredPlaylists);
    console.log(allSongs);
    //let [someResult, anotherResult] = await Promise.all([someCall(), anotherCall()]);
    //2
    //MUST USE SLICE HERE BECAUSE THE ALLSONGS ARRAY CLEARS IF YOU DO NOT????
    var musicAnalysisArray = await this.createAnalysisArray(allSongs.slice());
    console.log(musicAnalysisArray);
    //3
    musicAnalysisArray.forEach(songObj => {
      allSongs.find(x => x.id === songObj.id).song_analysis 
        = songObj.song_analysis;
    });
    
    //4
    this.setState({artistToSongMap: this.createArtistToSongMap(allSongs),
                   allSongsArray: allSongs,
                  loading: false,
                  currentTab: "songScatter"});
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  async createSongArray(playlists) {
    /*
        This function will return an array of all of the songs in all of the playlists
        passed through this.props.filteredPlaylists. It has to do this by calling the
        api for each playlist, hence the use of the APIHandler.
    */
    
    var promiseList = [];
    var i;
    const numPlaylists = playlists.length;
    for(i = 0; i < numPlaylists; i++){
      var playlist = playlists[i];
      if(playlist.tracks != null){
        const callURL = playlist.tracks.href;
        promiseList.push(getAllSongs(this.props.token, callURL));
      }
    }
    var allSongsArray = [];
    const values = await Promise.all(promiseList);
    values.forEach( value => {
      allSongsArray = [...allSongsArray, ...value];
    });
    const uniqueSongsArray = _.uniqBy(allSongsArray, "id");
    return uniqueSongsArray;
  }
  async createAnalysisArray(songsList){
    const analysisPromise = await this.getSongObjects(this.props.token, songsList);
    return analysisPromise;
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
  handleTabSwitch(pageName) {
    this.setState({currentTab: pageName});
  }
  renderTab(){
    const tabName = this.state.currentTab;
    if(tabName === "songScatter"){
      return this.renderSongScatterTab();
    }
    else if(tabName === "popularArtists"){
      return this.renderPopularArtistTab();
    }
    else{
      return this.renderSongChart();
    }
  }
  renderPopularArtistTab(){
    const divHeight = (this.state.height * 0.8 - 40) * 0.9;
    const divWidth = this.state.width * 0.7;
    return (
      <div className="popularArtistChartContainer">
        <Typography className="dataCardHeader" align='center' component='h1' variant='h2'>
          Most Popular Artists
        </Typography>
        <ArtistPieGraph artistToSongMap={this.state.artistToSongMap} />
      </div>
    );
  }
  renderSongScatterTab(){
    //will calculate the size of the container that SongGraph is being rendered into
    //because the dynamic sizing of Victory Graphs is not working properly
    const divHeight = (this.state.height * 0.8 - 40) * 0.9;
    const divWidth = this.state.width * 0.7;
    return (
      <div className="songPlotContainer">
        <SongGraph width={divWidth} height={divHeight} 
        allSongsArray={this.state.allSongsArray}/>
      </div>
    );
  }
  renderSongChart(){
    return (
      <div className="songChartContainer">
        <SongTable songList={this.state.allSongsArray}/>
      </div>
    );
  }
  render() {
    const dataPage = this.renderTab();
    return (
      <div className="AnalysisPage">
        {this.state.loading === true && (
          <div>
            <BarLoader
              color="#FFFFFF"
              height={10}
              width={400}
              loading={this.state.loading}
            />
            <div className="loading-text">
              Fetching the data <br />
              Hold tight!

            </div>
            
          </div>
        )}
        {this.state.loading === false && (
          <div className="AnalysisPageBody">
            <div className="tabContainer">
              <Button variant="contained" color="primary" onClick={() => this.handleTabSwitch("songScatter")}>Song Scatter</Button>
              <Button variant="contained" color="primary" onClick={() => this.handleTabSwitch("popularArtists")}>Artist Pie Chart</Button>
              <Button variant="contained" color="primary" onClick={() => this.handleTabSwitch("songList")}>Songs List</Button>
            </div>
            <div className="dataContainer">
              {dataPage}
            </div>
          </div>
        )}
      </div>
    );
  }
}