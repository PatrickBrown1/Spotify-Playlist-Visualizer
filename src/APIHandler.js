import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import axios from 'axios';
/*
  This function is the main api caller, and is called by each of api caller
  functions below. In reality, this is the only function I need, but including
  the ones below improves clarity when calling for data. The functions in this
  file are not supposed to do any data manipulation, only data fetching.

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
export async function getPlaylistNames(token){
  return fetchAxios(token, "https://api.spotify.com/v1/me/playlists");
}
export async function getNextPlaylistPage(token, next_page_call){
  return fetchAxios(token, next_page_call);
}
export async function getPrevPlaylistPage(token, prev_page_call){
  return fetchAxios(token, prev_page_call);
}