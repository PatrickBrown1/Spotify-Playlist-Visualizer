import React, { Component } from "react";

import { VictoryTheme, VictoryScatter, VictoryChart, VictoryLegend } from "victory";
export default class SongGraph extends Component {
  constructor(props) {
    super();
    this.state = {
    };
    console.log(props.allSongsArray);
  }

  componentDidMount() {
   
  }

  componentWillUnmount() {

  }
  render() {
    return (
      <div>
        <VictoryChart
            theme={VictoryTheme.material}
            domain={{ x: [0, 5], y: [0, 7] }}
            width={600}
            height={400}
        >
            <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={[
                { x: 1, y: 2 },
                { x: 2, y: 3 },
                { x: 3, y: 5 },
                { x: 4, y: 4 },
                { x: 5, y: 7 }
                ]}
            />
        </VictoryChart>
      </div>
    );
  }
}
