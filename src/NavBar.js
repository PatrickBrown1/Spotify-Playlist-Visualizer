

import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import SpotifyLogo from "./Spotify_Icon_RGB_Black.png";
import "./NavBar.css";
class NavBar extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="navbar">
            <img className="navbar-icon" src={SpotifyLogo} alt="Spotify Logo" />
            <h1>Playlist Analyzer</h1>
            <Link className="navlink" to="/">
                Home
            </Link>
            <Link className="navlink" to="/about">About</Link>
            <Link className="navlink" to="/data">Data</Link>
        </div>  
    );
  }
}

export default NavBar;
