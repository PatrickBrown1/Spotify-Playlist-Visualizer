import React, { Component } from "react";

import { VictoryTheme, VictoryScatter, VictoryChart, VictoryLabel, VictoryAxis } from "victory";
import "./SongGraph.css";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


  
  function createChartData(domain, range, props){
    var dataset = [];
    var domainName = domain;
    var rangeName = range;
    //need to create a data set with x and y
    props.allSongsArray.forEach(songObj => {
      if(songObj === undefined){
        console.log("undefined");
        console.log(songObj);
      }
      if(songObj === null){
        console.log("null");
        console.log(songObj);
      }
      if(songObj["song_analysis"] === undefined){
        console.log("song analysis undefined");
        console.log(songObj);
      }
      if(songObj["song_analysis"] === null){
        console.log("song analysis null");
        console.log(songObj);
      }
      dataset.push({
        x: songObj["song_analysis"][domainName],
        y: songObj["song_analysis"][rangeName],
        label_text: songObj["name"] + ": " + songObj["song_analysis"][domainName] + "," + songObj["song_analysis"][rangeName],
      })
    });
    return dataset;
  }
  function calculateDomain(domain, range){
    var domainObj = {};
    var domainName = domain;
    var rangeName = range;
    switch(domainName){
      case "acousticness":
        domainObj.x = [0, 1];
        break;
      case "danceability":
        domainObj.x = [0, 1];
        break;
      case "energy":
        domainObj.x = [0, 1];
        break;
      case "instrumentalness":
        domainObj.x = [0, 1];
        break;
      case "liveness":
        domainObj.x = [0, 1];
        break;
      case "loudness":
        domainObj.x = [-60, 0];
        break;
      case "speechiness":
        domainObj.x = [0, 1];
        break;
      case "valence":
        domainObj.x = [0, 1];
        break;
      case "tempo":
        domainObj.x = [0, 250];
        break;
      default:
        domainObj.x = [0, 100];
    }
    switch(rangeName){
      case "acousticness":
        domainObj.y = [0, 1];
        break;
      case "danceability":
        domainObj.y = [0, 1];
        break;
      case "energy":
        domainObj.y = [0, 1];
        break;
      case "instrumentalness":
        domainObj.y = [0, 1];
        break;
      case "liveness":
        domainObj.y = [0, 1];
        break;
      case "loudness":
        domainObj.y = [-60, 0];
        break;
      case "speechiness":
        domainObj.y = [0, 1];
        break;
      case "valence":
        domainObj.y = [0, 1];
        break;
      case "tempo":
        domainObj.y = [0, 250];
        break;
      default:
        domainObj.y = [0, 100];
    }
    return domainObj;
  }
  export default function SongGraph(props){
    const useStyles = makeStyles((theme) => ({
      root: {
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        color: 'black',
      },
      titlediv: {
        height: '5vh',
      },
      dropdownDiv: {
        display: "flex",
        flexDirection: 'row',
        height: '7vh',
      },
      dropdownItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%',
      },
      graphDiv: {
        height: '68vh',
      }
    }));
    const classes = useStyles();
    const [domain, setDomain] = React.useState("danceability");
    const [range, setRange] = React.useState("energy");

    var domainObj = calculateDomain(domain, range);
    const options = [
      'acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness',
      'loudness', 'speechiness', 'valence', 'tempo'
    ];    
    const onSelectX = (option) => {
      setDomain(option.value);
    }
    const onSelectY = (option) => {
      setRange(option.value);
    }
    return (
      <Box className={classes.root}>
        <div className={classes.titleDiv}>
          <h1>See all your songs!</h1>
        </div>
        <div className={classes.dropdownDiv}>
          <div className={classes.dropdownItem} >
            <h2 className="header-text">Domain (x)</h2>
            <Dropdown className="drop-down" options={options} onChange={onSelectX} value={domain} placeholder="Select an option" />
          </div>
          <div className={classes.dropdownItem} >
            <h2 className="header-text">Range (Y)</h2>
            <Dropdown className="drop-down" options={options} onChange={onSelectY} value={range} placeholder="Select an option" />
          </div>
        </div>
        <VictoryChart
            theme={VictoryTheme.material}
            domain={domainObj}
            width={props.width}
            height={props.height}
        >
            <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={createChartData(domain, range, props)}
                labels={({datum}) => ""}
                labelComponent={<VictoryLabel className="label-text"/>}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onMouseEnter: () => {
                        return [{
                          target: "labels",
                          mutation: (props) => {
                            console.log(props);
                            return {text: props.datum.label_text};
                          }
                        }, {
                          target: "data",
                          mutation: (props) => {
                            return { style: {fill: "#dc625a" }};
                          }
                        }];
                      },
                      onMouseLeave: () => {
                        return [{
                          target: "labels",
                          mutation: (props) => {
                            return {text: ""};
                          }
                        },
                        {
                          target: "data",
                          mutation: (props) => {
                            return null;
                          }
                        }];
                      }
                    }
                  }
                ]}
            />
            <VictoryAxis
              crossAxis
              domain={domainObj.x}
              label={domain}
              width={props.width}
              height={props.height}
              standalone={false}
              axisLabelComponent={<VictoryLabel dy={20} />}
            />
            <VictoryAxis
              dependentAxis
              domain={domainObj.y}
              label={range}
              width={props.width}
              height={props.height}
              standalone={false}
              axisLabelComponent={<VictoryLabel dy={-30} />}
            />
        </VictoryChart>
      </Box>
    );
  }