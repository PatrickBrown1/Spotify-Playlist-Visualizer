import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Playlists from "./Playlists";
import logo from "./logo.svg";
import "./App.css";

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
    this.getUserInformation = this.getUserInformation.bind(this);
    this.getPlaylistNames = this.getPlaylistNames.bind(this);
    this.removeNonOwnedPlaylists = this.removeNonOwnedPlaylists.bind(this);
    this.handleNextPlaylistPage = this.handleNextPlaylistPage.bind(this);
    this.handlePrevPlaylistPage = this.handlePrevPlaylistPage.bind(this);
    //this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });

      this.getUserInformation(_token);
      this.getPlaylistNames(_token, this.removeNonOwnedPlaylists);
    }
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  getUserInformation(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        // Checks if the data is not empty
        if (!data) {
          this.setState({
            no_user_data: true,
          });
          return;
        }
        //DOES GET IN HERE JUST FINE
        //alert("eee");
        this.setState({
          user_info: data,
          no_user_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */,
        });
      },
    });
  }

  getPlaylistNames(token, sortOnlyOwned) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/playlists",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        // Checks if the data is not empty
        if (!data) {
          this.setState({
            no_playlist_data: true,
          });
          return;
        }
        this.setState({
          playlist_paging_object: data,
          playlists: data.items,
          number_playlists: data.total,
          no_playlist_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */,
        });
        sortOnlyOwned();
      },
    });
  }
  handleNextPlaylistPage() {
    if (this.state.playlist_paging_object.next !== null) {
      this.setState({ playlist_page: this.state.playlist_page + 1 });
      let next_page_call = this.state.playlist_paging_object.next;
      $.ajax({
        url: next_page_call,
        type: "GET",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
        },
        success: (data) => {
          // Checks if the data is not empty
          if (!data) {
            this.setState({
              no_playlist_data: true,
            });
            return;
          }

          this.setState({
            playlist_paging_object: data,
            playlists: data.items,
            no_playlist_data: false /* We need to "reset" the boolean, in case the
                              user does not give F5 and has opened his Spotify. */,
          });

          this.removeNonOwnedPlaylists();
        },
      });
    }
  }
  handlePrevPlaylistPage() {
    if (this.state.playlist_paging_object.previous !== null) {
      this.setState({ playlist_page: this.state.playlist_page - 1 });
      let prev_page_call = this.state.playlist_paging_object.previous;
      $.ajax({
        url: prev_page_call,
        type: "GET",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
        },
        success: (data) => {
          // Checks if the data is not empty
          if (!data) {
            this.setState({
              no_playlist_data: true,
            });
            return;
          }

          this.setState({
            playlist_paging_object: data,
            playlists: data.items,
            no_playlist_data: false /* We need to "reset" the boolean, in case the
                              user does not give F5 and has opened his Spotify. */,
          });
          this.removeNonOwnedPlaylists();
        },
      });
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
