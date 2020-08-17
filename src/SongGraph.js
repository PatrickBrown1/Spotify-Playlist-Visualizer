import React, { Component } from "react";

import { VictoryTheme, VictoryScatter, VictoryChart, VictoryAxis } from "victory";
export default class SongGraph extends Component {
  constructor(props) {
    super();
    this.state = {
    };
    console.log(props.allSongsArray);
    this.createChartData = this.createChartData.bind(this);
    this.calculateDomain = this.calculateDomain.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }
  createChartData(domainName, rangeName){
    var dataset = [];
    //need to create a data set with x and y
    this.props.allSongsArray.forEach(songObj => {
      dataset.push({
        x: songObj["song_analysis"][domainName],
        y: songObj["song_analysis"][rangeName]
      })
    });
    return dataset;
  }
  calculateDomain(domainName, rangeName){
    var domainObj = {};
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
        domainObj.x = [0, 200];
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
        domainObj.y = [0, 200];
        break;
      default:
        domainObj.y = [0, 100];
    }
    return domainObj;
  }
  render() {
    return (
      <div>
        <VictoryChart
            theme={VictoryTheme.material}
            domain={this.calculateDomain("danceability", "energy")}
            width={600}
            height={400}
        >
            <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={this.createChartData("danceability", "energy")}
            />
        </VictoryChart>
      </div>
    );
  }
}
