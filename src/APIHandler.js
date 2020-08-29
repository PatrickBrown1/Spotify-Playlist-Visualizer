/* eslint-disable no-loop-func */
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import axios from 'axios';
/*
  This function is the default api caller, and is called by each of api caller
  functions below UNLESS I have created a custop fetching method. In reality, 
  this is the one of the few function I need, but including the ones below 
  improves clarity when calling for data. The functions in this file are not
  supposed to do any data manipulation, only data fetching.

  These functions return raw data. If the data is not retrieved well by the servers,
  it will catch the rror (depending on if it's a response, request, or other error)
*/
async function fetchAxios(token, call_url){
  return axios({
    method: "GET",
    url: call_url,
    headers: {
      "Authorization": "Bearer " + token,
    },
  }).then((data) => { 
    return data
  }).catch((error) => {
    //this is taken from: https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log(error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.log('Error', error.message);
    }
    console.log(error);
  });
}

export async function getUserInformation (token) {
  // Make a call using the token
  return fetchAxios(token, "https://api.spotify.com/v1/me");
}
/*
  returns an array of playlist objects
*/
export async function getPlaylistNames(token){
  return fetchAllPlaylists(token);
}
/*
  To ensure that I've gotten all of the playlists (not just the first page worth),
  I need to call the playlist paging object and figure out how many total playlists
  there are. I create a while loop that continues pulling playlist paging objects
  as long as they exist, and adding each playlist to the array.
*/
async function fetchAllPlaylists(token){
  var all_playlists_array = [];
  var next_page_exists = true;
  var page = 1;
  const limit = 50; //maximum
  var offset = 0;
  var current_url = "https://api.spotify.com/v1/me/playlists?limit=" + limit + "&offset=" + offset;
  var paging_object = null;
  while(next_page_exists){

    //current_url is instantiated with the first call url, the paging object is updated
    //after the first call. If the paging object is not null, it will get the url from the
    //paging object, otherwise it will take it from the instantiation.
    if(paging_object !== null)
      current_url = paging_object.next;
    console.log("Fetching playlists " + offset + " - " + (offset + limit) );
    let data = await axios({
      method: "GET",
      url: current_url,
      headers: {
        "Authorization": "Bearer " + token,
      },
    }).then((data) => {
      if(data.data.next === null){
        //break!
        next_page_exists = false;
      }
      paging_object = data.data;
      //console.log("data.data.items: " + data.data.items);
      all_playlists_array = all_playlists_array.concat(data.data.items); 
      //console.log(all_playlists_array);
    }).catch((error) => {
      //this is taken from: https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
      // Error 😨
      //need to break the loop
      next_page_exists = false;
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
      }
      console.log(error);
    });
    offset = offset + 50;
    page = page + 1;
  }
  console.log(all_playlists_array);
  return all_playlists_array;
}
export async function getAllSongs(token, first_page){
  console.log("fetching songs");
  var all_songs_playlist = [];
  var current_page = first_page;
  console.log("get all songs, link: " + current_page);
  var call = 1;
  while(current_page != null){
    //make api call
    let data = await axios({
      method: "GET",
      url: current_page,
      headers: {
        "Authorization": "Bearer " + token,
      },
    }).then((data) => {
      var paging_object = data.data;
      current_page = paging_object.next;
      var current_call_songs = paging_object.items;
      call++;
      //the paging object items contains an array of playlist tracj=k objects, need to parse into the track object
      var i;
      const len = current_call_songs.length;
      for(i = 0; i < len; i++){
        all_songs_playlist.push(current_call_songs[i].track);
      }
     
    }).catch((error) => {
      //this is taken from: https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
      // Error 😨
      //need to break the loop
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if(error.response.status == 429){
            console.log("429 error... waiting");
            console.log("headers: " + error.response.headers);
            var timeToWait = parseInt(error.response.headers["retry-after"]);
            console.log("waiting... " + timeToWait + "s");
            this.timeout(timeToWait*1000+1);
          }
          else{
            current_page = null;
          }
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          
        current_page = null;
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error 
          current_page = null;
          console.log('Error', error.message);
      }
      console.log(error);
    });
  }
  console.log("ALL SONG PLAYLIST");
  console.log(all_songs_playlist);
  return all_songs_playlist;
}
export async function getSongObjects(token, songArrayVar){
  //need to parse the array into comma separated lists of max length 100 songs,
  console.log("GETTING SONG OBJECTS");
  var songArray = songArrayVar.slice();
  var song_object_list = [];
  var call_link = "https://api.spotify.com/v1/audio-features";
  var songs_left = true;
  while(songs_left == true){
    //create song object call link
    var id_list = "";
    var i = 0;
    while(songArray.length > 0 && i < 100){
      if(i%100 != 0){ //to ensure the last one doesn't have a comma, we put commas at the front
        id_list += ",";
      }
      id_list += songArray.pop().id;
      i++;
    }
    //console.log("i: " + i);
    if(songArray.length === 0){
      songs_left = false;
    }
    //console.log("COMMA LIST: " + id_list);

    //now that we have created the link, we need to call the api with that link
    let data = await axios({
      method: "GET",
      url: call_link,
      params: {
        ids: id_list,
      },
      headers: {
        "Authorization": "Bearer " + token,
      },
    }).then((data) => {
      var features = data.data.audio_features;
      //console.log("FEATURES");
      //console.log(features);
      features.forEach(songObj => {
        song_object_list.push({id: songObj.id, song_analysis: songObj});
      });
    }).catch((error) => {
      //this is taken from: https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
      // Error 😨
      //need to break the loop
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if(error.response.status == 429){
            console.log("429 error... waiting");
            console.log("headers: " + error.response.headers);
            var timeToWait = parseInt(error.response.headers["retry-after"]);
            console.log("waiting... " + timeToWait + "s");
            this.timeout(timeToWait*1000+1);
          }
          else{
            songs_left = false;
          }
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          
          songs_left = false;
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error 
            songs_left = false;
          console.log('Error', error.message);
      }
      console.log(error);
    });

  }
  //console.log("ALL SONG OBJECT PLAYLIST");
  //console.log(song_object_list);
  console.log("---------------------------------------");
  return song_object_list;
}
// export async function getNextPlaylistPage(token, next_page_call){
//   return fetchAxios(token, next_page_call);
// }
// export async function getPrevPlaylistPage(token, prev_page_call){
//   return fetchAxios(token, prev_page_call);
// }
function timeout(ms) { //pass a time in milliseconds to this function
  return new Promise(resolve => setTimeout(resolve, ms));
}