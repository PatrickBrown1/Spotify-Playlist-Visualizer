import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import axios from 'axios';
import Playlists from "./Playlists";
import logo from "./logo.svg";
import "./App.css";
import { getUserInformation, getPlaylistNames,
         getNextPlaylistPage, getPrevPlaylistPage} from "./APIHandler.js";
class App extends Component {
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
      playlist_paging_object: null,
      playlists: null,
      number_playlists: 0,
      playlist_page: 1,
    };
    this.getUserInformation = getUserInformation.bind(this);
    this.getPlaylistNames = getPlaylistNames.bind(this);
    this.getNextPlaylistPage = getNextPlaylistPage.bind(this);
    this.getPrevPlaylistPage = getPrevPlaylistPage.bind(this);
    this.removeNonOwnedPlaylists = this.removeNonOwnedPlaylists.bind(this);
    this.handleNextPlaylistPage = this.handleNextPlaylistPage.bind(this);
    this.handlePrevPlaylistPage = this.handlePrevPlaylistPage.bind(this);
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
      const playlistInfo = await getPlaylistNames(_token);
      if(playlistInfo){
        this.setState({playlist_paging_object: playlistInfo.data,
          playlists: playlistInfo.data.items,
          number_playlists: playlistInfo.data.total,
          no_playlist_data: false,
        });
      } else {
        this.setState({ no_playlist_data: true, });
      }
    }
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }
  
  async handleNextPlaylistPage() {
    if (this.state.playlist_paging_object.next !== null) {
      this.setState({ playlist_page: this.state.playlist_page + 1 });
      let next_page_call = this.state.playlist_paging_object.next;
      const data = await this.getNextPlaylistPage(this.state.token, next_page_call);
      if (!data.data) {
        this.setState({
          no_playlist_data: true,
        });
      } else {
        this.setState({
          playlist_paging_object: data.data,
          playlists: data.data.items,
          no_playlist_data: false ,
        });
      }
    }
  }
  async handlePrevPlaylistPage() {
    if (this.state.playlist_paging_object.previous !== null) {
      this.setState({ playlist_page: this.state.playlist_page - 1 });
      let prev_page_call = this.state.playlist_paging_object.previous;
      const data = await this.getPrevPlaylistPage(this.state.token, prev_page_call);
      if (!data.data) {
        this.setState({
          no_playlist_data: true,
        });
      } else {
        this.setState({
          playlist_paging_object: data.data,
          playlists: data.data.items,
          no_playlist_data: false ,
        });
      }
    }
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
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}

          {this.state.no_playlist_data && (
            <p>You dont have any playlist data</p>
          )}

          {this.state.token && !this.state.no_playlist_data && (
            <div>
              <h1>Hello, {this.state.user_info.display_name}</h1>
              <h1>Playlists</h1>
              <Playlists playlists={this.state.playlists} />
              {this.state.playlist_paging_object.previous !== null && (
                <button onClick={this.handlePrevPlaylistPage}>Prev</button>
              )}
              {this.state.playlist_paging_object.next !== null && (
                <button onClick={this.handleNextPlaylistPage}>Next</button>
              )}
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
