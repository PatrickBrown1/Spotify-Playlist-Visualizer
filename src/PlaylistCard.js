import React, { Component } from "react";
import "./PlaylistCard.css";
import {Card} from 'antd';
const { Meta } = Card;
var PlaylistCard = function(props) { 
    //obj.image returnms array of image objects
    const playlistName = props.playlistObject.name;
    const playlistNumTracks = props.playlistObject.tracks.total;
    const playlistOwner = props.playlistObject.owner.display_name;
    const imageArray = props.playlistObject.images;
    //first image in imageArray is the biggest (index 0). use this and rescale down
    const colaborative = props.playlistObject.colaborative;
    if(props.toBeUsed){
        return(
            <Card bordered={true} onClick={() => props.handleCardClick(props.playlistObject.id)}>
                <div className="card">
                    <div className="image-container">
                        <img className = "album-image" src={imageArray[0].url}></img>
                    </div>
                    <div className="divider"></div>
                    <div className="text-container">
                        <div className="title-container"> 
                            <h1>{playlistName}</h1>
                        </div>
                        <div className="info-container">
                            <span style={{fontWeight: "bold",}}>Owner:</span> {playlistOwner} <br/>
                            <span style={{fontWeight: "bold",}}>No. Songs:</span>  {playlistNumTracks} <br />
                            <span style={{fontWeight: "bold",}}>Colaborative:</span>  {colaborative}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
    else{
        return(
            <Card className="opacitygrayscale" bordered={true} onClick={() => props.handleCardClick(props.playlistObject.id)}>
                <div className="card">
                    <div className="image-container">
                        <img className = "album-image" src={imageArray[0].url}></img>
                    </div>
                    <div className="divider"></div>
                    <div className="text-container">
                        <div className="title-container"> 
                            <h1>{playlistName}</h1>
                        </div>
                        <div className="info-container">
                            <span style={{fontWeight: "bold",}}>Owner:</span> {playlistOwner} <br/>
                            <span style={{fontWeight: "bold",}}>No. Songs:</span>  {playlistNumTracks} <br />
                            <span style={{fontWeight: "bold",}}>Colaborative:</span>  {colaborative}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
    
};
export default PlaylistCard;