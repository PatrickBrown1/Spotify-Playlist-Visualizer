import React, { Component } from "react";
import "./Card.css";
import { configConsumerProps } from "antd/lib/config-provider";
var Card = function(props) { 
    //obj.image returnms array of image objects
    const playlistName = props.playlistObject.name;
    const playlistNumTracks = props.playlistObject.tracks.total;
    const playlistOwner = props.playlistObject.owner.display_name;
    const imageArray = props.playlistObject.images;
    //first image in imageArray is the biggest (index 0). use this and rescale down
    return(
        <div className="card">
            <div className="image-container">
                <img className = "album-image" src={imageArray[0].url}></img>
            </div>
            <div className="text-container">
                {playlistName} <br />
                {playlistOwner} <br />
                {playlistNumTracks} <br />
            </div>
        </div>
    );
};
export default Card;