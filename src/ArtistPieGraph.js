import React, { Component } from "react";

import { VictoryPie, VictoryLegend, VictoryTooltip } from "victory";


export default class ArtistPieGraph extends Component {
  constructor(props) {
    super();
    this.state = {
    };
    this.popularArtistPieChart = this.popularArtistPieChart.bind(this);
  }
  componentDidMount() {
  }

  componentWillUnmount() {

  }
  popularArtistPieChart(){
    var data = [];
    var legendData = [];
    var artistToSongMapVar = this.props.artistToSongMap;
    var biggestArtistList = [];
    var smallerArtistList = [];
    const totalSections = 5;
    const compare = (a, b) => {
      // Use toUpperCase() to ignore character casing
      const numA = a.y;
      const numB = b.y;
    
      let comparison = 0;
      if (numA > numB) {
        comparison = 1;
      } else if (numA < numB) {
        comparison = -1;
      }
      return comparison*-1;
    }
    //iterate through each artist
    //if the artist has more songs than someone in the "biggestArtistList",
    //pop that artist and add the new artist to the biggestArtistLists
    //add the old artist to the smallerArtistLists

    Object.keys(artistToSongMapVar).forEach(function (key) {
      var nameArtist = key;
      var numSongs = artistToSongMapVar[key].length;
      if(biggestArtistList.length < totalSections){
        //must populate the bigestArtistList with the first 5 artists
        biggestArtistList.push({x: nameArtist, y: numSongs, label: nameArtist + ", " + numSongs + " songs"});
      }
      else{
        //if the current artist is bigger than the smallest artist of the biggest artists,
        //move the smallest artist to the smallerArtistList, and add the new artist
        //sorting the list to the smallest is at the end, so only have to check last location
        biggestArtistList.sort(compare);
        var smallestArtist = biggestArtistList[4];
        if(numSongs > smallestArtist["y"]){
          biggestArtistList.pop();
          biggestArtistList.push({x: nameArtist, y: numSongs, label: nameArtist + ", " + numSongs + " songs"});
          smallerArtistList.push(smallestArtist);
          
          biggestArtistList.sort(compare);
        }
        else{
          smallerArtistList.push({x: nameArtist, y: numSongs, label: nameArtist + ", " + numSongs + " songs"});
        }
      }
      //data.push({x: key, y: artistToSongMapVar[key].length});
    });
    biggestArtistList.forEach(obj => {
      data.push(obj)
      legendData.push({name: obj.x});
    });
    
    var numOther = 0;
    smallerArtistList.forEach(obj => {numOther += obj.y});
    if(numOther != 0){
        data.push({x: "Other", y: numOther, label: "Other, " + numOther + " songs"});
        legendData.push({name: "Other"});
    }
    console.log(legendData);
    
    return [data, legendData];
  }
  render() {
    const chartData = this.popularArtistPieChart();
    return (
      <div>
        <svg viewBox="0 0 600 400" style={{overflow:"visible"}}>
            <VictoryPie standalone={false}
                padding={{ top: 50, bottom: 50, left: 100, right: -300}}
                width={400} height={350}
                colorScale={["tomato", "orange", "gold", "lightblue", "darkorchid", "lightgreen"]}
                labels={({datum}) => "a"}
                labelComponent={
                  <VictoryTooltip
                    center
                    cornerRadius={0}
                    pointerLength={0}
                    flyoutPadding={10}
                    flyoutStyle={{
                      stroke: "black",
                      fill: "white"
                    }}
                  />
                }
                
                data={chartData[0]}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onMouseOver: () => {
                        
                        this.setState({A: "a"});
                        return [
                          {
                            target: "labels",
                            mutation: () => ({ active: true })
                          }
                        ];
                      },
                      onMouseOut: () => {
                        
                        this.setState({A: "a"});
                        return [
                          {
                            target: "labels",
                            mutation: () => ({ active: false })
                          }
                        ];
                      }
                    }
                  }
                ]}
            />
            <VictoryLegend standalone={false}
                title="Legend"
                centerTitle
                x={20} y={80}
                width={50} height={200}
                padding={{top: 100, bottom: 100, left: 10}}
                borderPadding={{ left: 15, right: 20 }}
                colorScale={["tomato", "orange", "gold", "lightblue", "darkorchid", "lightgreen"]}
                style={{ border: { stroke: "black" }, }}
                data={chartData[1]}
            />   
      </svg>
      </div>
    );
  }
}
