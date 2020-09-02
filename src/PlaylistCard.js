import React, { Component } from "react";
import "./PlaylistCard.css";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
var PlaylistCard = function (props) {
  const useStyles = makeStyles((theme) => ({
    card: {
      display: "flex",
      transition: "box-shadow 0.2s",
      height: "17vw",
      width: "34vw",
      opacity: 1,
      filter: "grayscale(0%)",
      "&:hover": {
        transition: "box-shadow 0.2s",
        boxShadow:
          "0 3px 6px -4px rgba(0, 0, 0, 0.36), 0 6px 16px 0 rgba(0, 0, 0, 0.24), 0 9px 28px 8px rgba(0, 0, 0, 0.15)",
      },
    },
    cardGrayscale: {
      display: "flex",
      transition: "box-shadow 0.2s",
      height: "17vw",
      width: "34vw",
      opacity: 1,
      filter: "grayscale(0%)",
      "&:hover": {
        transition: "box-shadow 0.2s",
        boxShadow:
          "0 3px 6px -4px rgba(0, 0, 0, 0.36), 0 6px 16px 0 rgba(0, 0, 0, 0.24), 0 9px 28px 8px rgba(0, 0, 0, 0.15)",
      },
      opacity: "0.4",
      filter: "grayscale(70%)",
    },
    textContainer: {
      display: "flex 1 0 auto",
      flexDirection: "column",
      width: "17vw",
      height: "17vw",
      padding: "5px",
      margin: 0,
    },
    titlePadding: {
      padding: "10px",
    },
    albumImage: {
      minHeight: "17vw",
      minWidth: "17vw",
      maxHeight: "17vw",
      maxWidth: "17vw",
    },
    infoContainer: {
      color: "black",
      width: "100%",
      "& span": {
        fontStyle: "bold",
      },
      padding: "10px",
    },
  }));
  const classes = useStyles();

  const playlistName = props.playlistObject.name;
  const playlistNumTracks = props.playlistObject.tracks.total;
  const playlistOwner = props.playlistObject.owner.display_name;
  const imageArray = props.playlistObject.images;
  //first image in imageArray is the biggest (index 0). use this and rescale down
  const collaborative = props.playlistObject.collaborative;
  if (props.toBeUsed) {
    return (
      <Card
        className={classes.card}
        bordered={true}
        onClick={() => props.handleCardClick(props.playlistObject.id)}
      >
        <CardMedia
          className={classes.albumImage}
          component="img"
          image={imageArray[0].url}
          title={playlistName + " playlist cover"}
        />
        <CardContent className={classes.textContainer}>
          <Typography
            className={classes.titlePadding}
            align="center"
            variant="h4"
            component="h3"
          >
            {playlistName}
          </Typography>
          <Divider />
          <div className={classes.infoContainer}>
            <Typography align="center" variant="body1">
              <b>Owner:</b> {playlistOwner}
            </Typography>
            <Typography align="center" variant="body1">
              <b>No. Songs:</b> {playlistNumTracks}
            </Typography>
            <Typography align="center" variant="body1">
              <b>Collaborative:</b> {collaborative ? "True" : "False"}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card
        className={classes.cardGrayscale}
        bordered={true}
        onClick={() => props.handleCardClick(props.playlistObject.id)}
      >
        <CardMedia
          className={classes.albumImage}
          component="img"
          image={imageArray[0].url}
          title={playlistName + " playlist cover"}
        />
        <CardContent className={classes.textContainer}>
          <Typography
            className={classes.titlePadding}
            align="center"
            variant="h4"
            component="h3"
          >
            {playlistName}
          </Typography>
          <Divider />
          <div className={classes.infoContainer}>
            <Typography align="center" variant="body1">
              <b>Owner:</b> {playlistOwner}
            </Typography>
            <Typography align="center" variant="body1">
              <b>No. Songs:</b> {playlistNumTracks}
            </Typography>
            <Typography align="center" variant="body1">
              <b>Collaborative:</b> {collaborative ? "True" : "False"}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
};
export default PlaylistCard;
