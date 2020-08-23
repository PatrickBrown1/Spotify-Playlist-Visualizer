import React, { Component } from "react";
import { useLocation } from "react-router";
import { getAllSongs, getSongObjects } from "../APIHandler.js";
import { VictoryPie, VictoryLegend } from "victory";
import "./AnalysisPage.css";
import SongGraph from "../SongGraph.js"
import _ from "lodash";

export default class AnalysisPage extends Component {
  constructor() {
    super();
    this.state = {};
    //filtered list of playlists will be passed into props as
    //filteredPlaylists
    this.getAllSongs = getAllSongs.bind(this);
    this.getSongObjects = getSongObjects.bind(this);
    this.createSongArray = this.createSongArray.bind(this);
    this.calculateMostPopularGenre = this.calculateMostPopularGenre.bind(this);
    this.createArtistToSongMap = this.createArtistToSongMap.bind(this);
    this.popularArtistPieChart = this.popularArtistPieChart.bind(this);
    this.createAnalysisArray = this.createAnalysisArray.bind(this);
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
                   allSongsArray: allSongs});
  }
  componentWillUnmount() {}
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
  popularArtistPieChart(){
    var data = [];
    var legendData = [];
    var artistToSongMapVar = this.state.artistToSongMap;
    var biggestArtistList = [];
    var smallerArtistList = [];
    const totalSections = 5;
    const compare = (a, b) => {
      // Use toUpperCase() to ignore character casing
      const numA = a.y;
      const numB = b.y;
    
      let comparison = 0;
      if (numA > numB) {
        comparison = 1;
      } else if (numA < numB) {
        comparison = -1;
      }
      return comparison*-1;
    }
    //iterate through each artist
    //if the artist has more songs than someone in the "biggestArtistList",
    //pop that artist and add the new artist to the biggestArtistLists
    //add the old artist to the smallerArtistLists

    Object.keys(artistToSongMapVar).forEach(function (key) {
      var nameArtist = key;
      var numSongs = artistToSongMapVar[key].length;
      if(biggestArtistList.length < totalSections){
        //must populate the bigestArtistList with the first 5 artists
        biggestArtistList.push({x: nameArtist, y: numSongs});
      }
      else{
        //if the current artist is bigger than the smallest artist of the biggest artists,
        //move the smallest artist to the smallerArtistList, and add the new artist
        //sorting the list to the smallest is at the end, so only have to check last location
        biggestArtistList.sort(compare);
        var smallestArtist = biggestArtistList[4];
        if(numSongs > smallestArtist["y"]){
          biggestArtistList.pop();
          biggestArtistList.push({x: nameArtist, y: numSongs});
          smallerArtistList.push(smallestArtist);
          
          biggestArtistList.sort(compare);
        }
        else{
          smallerArtistList.push({x: nameArtist, y: numSongs});
        }
      }
      //data.push({x: key, y: artistToSongMapVar[key].length});
    });
    biggestArtistList.forEach(obj => {
      data.push(obj)
      legendData.push({name: obj.x});
    });
    legendData.push({name: "Other"});
    var numOther = 0;
    smallerArtistList.forEach(obj => {numOther += obj.y});
    data.push({x: "Other", y: numOther});
    console.log(legendData);
    return (
      <svg viewBox="0 0 600 400">
        <VictoryPie standalone={false}
          padding={{ top: 50, bottom: 50, left: 100, right: -300}}
          width={400} height={350}
          colorScale={["tomato", "orange", "gold", "lightblue", "lightyellow", "lightgreen"]}
          labels={() => null}
          data={data}
        />
        <VictoryLegend standalone={false}
          title="Legend"
          centerTitle
          x={20} y={80}
          width={50} height={200}
          padding={{top: 100, bottom: 100, left: 10}}
          borderPadding={{ left: 15, right: 20 }}
          colorScale={["tomato", "orange", "gold", "lightblue", "lightyellow", "lightgreen"]}
          style={{ border: { stroke: "black" }, }}
          data={legendData}
        />   
      </svg>
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
      <div className="AnalysisPage">
        analysis
        {this.state.artistToSongMap !== undefined && (
          <div className="dataContainer">
            <div className="songPlotContainer">
              <h1 className="dataCardHeader">See all your songs!</h1>
              <SongGraph allSongsArray={this.state.allSongsArray}/>
            </div>
            <div className="popularArtistChartContainer">
              <h1 className="dataCardHeader">Most Popular Artists</h1>
              {this.popularArtistPieChart()}
            </div>
          </div>
        )}
      </div>
    );
  }
}
