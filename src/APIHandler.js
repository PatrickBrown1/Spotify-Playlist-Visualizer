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
// export async function getNextPlaylistPage(token, next_page_call){
//   return fetchAxios(token, next_page_call);
// }
// export async function getPrevPlaylistPage(token, prev_page_call){
//   return fetchAxios(token, prev_page_call);
// }