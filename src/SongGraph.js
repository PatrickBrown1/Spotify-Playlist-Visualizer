import React, { Component } from "react";

import { VictoryTheme, VictoryScatter, VictoryChart, VictoryLabel, VictoryAxis } from "victory";
import "./SongGraph.css";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default class SongGraph extends Component {
  constructor(props) {
    super();
    this.state = {
      domain: "danceability",
      range: "energy",
    };
    this.createChartData = this.createChartData.bind(this);
    this.calculateDomain = this.calculateDomain.bind(this);
    this._onSelectX = this._onSelectX.bind(this)
    this._onSelectY = this._onSelectY.bind(this)
  }
  _onSelectX (option) {
    console.log('You selected domain ', option.label);
    this.setState({domain: option.value});
  }
  _onSelectY (option) {
    console.log('You selected range', option.label);
    this.setState({range: option.value});
  }
  componentDidMount() {
  }

  componentWillUnmount() {

  }
  createChartData(domain, range){
    var dataset = [];
    var domainName = domain;
    var rangeName = range;
    //need to create a data set with x and y
    this.props.allSongsArray.forEach(songObj => {
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
  calculateDomain(domain, range){
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
  render() {
    var domainName = this.state.domain;
    var rangeName = this.state.range;
    var domainObj = this.calculateDomain(domainName, rangeName);
    const options = [
      'acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness',
      'loudness', 'speechiness', 'valence', 'tempo'
    ];    
    return (
      <div>
        <div className="text-div">
          <h2 className="header-text">Domain (x)</h2>
          <h2 className="header-text">Range (Y)</h2>
        </div>
        <div className="dropdown-div">
          <Dropdown className="drop-down" options={options} onChange={this._onSelectX} value={domainName} placeholder="Select an option" />
          <Dropdown className="drop-down" options={options} onChange={this._onSelectY} value={rangeName} placeholder="Select an option" />
        </div>
        <VictoryChart
            theme={VictoryTheme.material}
            domain={domainObj}
            width={600}
            height={400}
        >
            <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={this.createChartData(domainName, rangeName)}
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
                            this.setState({A: "a"});
                            console.log(props);
                            return {text: props.datum.label_text};
                          }
                        }, {
                          target: "data",
                          mutation: (props) => {
                            this.setState({A: "a"});
                            return { style: {fill: "#dc625a" }};
                          }
                        }];
                      },
                      onMouseLeave: () => {
                        return [{
                          target: "labels",
                          mutation: (props) => {
                            this.setState({A: "a"});
                            return {text: ""};
                          }
                        },
                        {
                          target: "data",
                          mutation: (props) => {
                            this.setState({A: "a"});
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
              label={this.state.domain}
              width={600}
              height={400}
              standalone={false}
              axisLabelComponent={<VictoryLabel dy={20} />}
            />
            <VictoryAxis
              dependentAxis
              domain={domainObj.y}
              label={this.state.range}
              width={600}
              height={400}
              standalone={false}
              axisLabelComponent={<VictoryLabel dy={-30} />}
            />
        </VictoryChart>
      </div>
    );
  }
}
