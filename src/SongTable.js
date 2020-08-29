import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
export default class SongTable extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.createData = this.createData.bind(this);
  }
  componentWillMount() {
    //create the row array with the song props
    console.log(this.props.songList);
    var rows = this.props.songList.map((songObj) => {
      console.log(songObj);
      return this.createData(songObj);
    });
    console.log(rows);
    this.setState({ chartRows: rows });
  }

  createData(songObj) {
    //songs may have multiple artists, will concatenate with commas
    var artists = "";
    var count = 0;
    songObj.artists.forEach((artistObj) => {
      if (count !== 0) {
        artists += ", ";
      }
      artists += artistObj.name;
      count++;
    });
    const songname = songObj.name;
    const album = songObj.album.name;
    const acousticness = songObj.song_analysis.acousticness;
    const danceability = songObj.song_analysis.danceability;
    const energy = songObj.song_analysis.energy;
    const instrumentalness = songObj.song_analysis.instrumentalness;
    const liveness = songObj.song_analysis.liveness;
    const loudness = songObj.song_analysis.loudness;
    const speechiness = songObj.song_analysis.speechiness;
    const valence = songObj.song_analysis.valence;
    const tempo = songObj.song_analysis.tempo;
    return {
      songname,
      artists,
      album,
      acousticness,
      danceability,
      energy,
      instrumentalness,
      liveness,
      loudness,
      speechiness,
      valence,
      tempo,
    };
  }
  render() {
    const rows = this.state.chartRows;
    return (
      <Paper>
        <TableContainer style={{maxHeight: "80vh"}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Artist(s)</TableCell>
                <TableCell align="right">Album</TableCell>
                <TableCell align="right">Acousticness</TableCell>
                <TableCell align="right">Danceability</TableCell>
                <TableCell align="right">Energy</TableCell>
                <TableCell align="right">Instumentalness</TableCell>
                <TableCell align="right">Liveness</TableCell>
                <TableCell align="right">Loudness</TableCell>
                <TableCell align="right">Speechiness</TableCell>
                <TableCell align="right">Valence</TableCell>
                <TableCell align="right">Tempo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={row.songname}>
                  <TableCell component="th" scope="row">
                    {row.songname}
                  </TableCell>
                  <TableCell align="right">{row.artists}</TableCell>
                  <TableCell align="right">{row.album}</TableCell>
                  <TableCell align="right">{row.acousticness}</TableCell>
                  <TableCell align="right">{row.danceability}</TableCell>
                  <TableCell align="right">{row.energy}</TableCell>
                  <TableCell align="right">{row.instrumentalness}</TableCell>
                  <TableCell align="right">{row.liveness}</TableCell>
                  <TableCell align="right">{row.loudness}</TableCell>
                  <TableCell align="right">{row.speechiness}</TableCell>
                  <TableCell align="right">{row.valence}</TableCell>
                  <TableCell align="right">{row.tempo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}
