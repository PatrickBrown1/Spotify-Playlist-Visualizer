import React, { Component } from "react";
import {useLocation} from "react-router";
export default class AnalysisPage extends Component{
    constructor(){
        super();
        this.state = {

        };
        //filtered list of playlists will be passed into props as
        //filteredPlaylists
    }
    componentDidMount(){
    }
    componentWillUnmount() {
    }
    render(){
        return (
            <div>
                analysis
            </div>
        );
    }
}