import React, { Component } from "react";
import "./PlaylistCard.css";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

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
            <Card className="card" bordered={true} onClick={() => props.handleCardClick(props.playlistObject.id)}>
                <CardMedia 
                    className = "album-image"
                    component="img"
                    image={imageArray[0].url}
                    title={playlistName + " playlist cover"}
                />
                <CardContent className="text-container">
                    <div className="title-container"> 
                        <h1>{playlistName}</h1>
                    </div>
                    <div className="info-container">
                        <span style={{fontWeight: "bold",}}>Owner:</span> {playlistOwner} <br/>
                        <span style={{fontWeight: "bold",}}>No. Songs:</span>  {playlistNumTracks} <br />
                        <span style={{fontWeight: "bold",}}>Colaborative:</span>  {colaborative}
                    </div>
                </CardContent>
            </Card>
        );
    }
    else{
        return(
            <Card className="card opacitygrayscale" bordered={true} onClick={() => props.handleCardClick(props.playlistObject.id)}>
                <CardMedia 
                    className = "album-image"
                    image={imageArray[0].url}
                    title={playlistName + " playlist cover"}
                />
                <CardContent className="text-container">
                    <div className="title-container"> 
                        <h1>{playlistName}</h1>
                    </div>
                    <div className="info-container">
                        <span style={{fontWeight: "bold",}}>Owner:</span> {playlistOwner} <br/>
                        <span style={{fontWeight: "bold",}}>No. Songs:</span>  {playlistNumTracks} <br />
                        <span style={{fontWeight: "bold",}}>Colaborative:</span>  {colaborative}
                    </div>
                </CardContent>
            </Card>
        );
    }
    
};
export default PlaylistCard;