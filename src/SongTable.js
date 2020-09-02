import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableSortLabel from "@material-ui/core/TableSortLabel";

function descendingComparator(a, b, orderBy) {
  if(orderBy === "songname" || orderBy === "artists"){
    if (b[orderBy].localeCompare(a[orderBy]) < 0) {
      return -1;
    }
    else if(b[orderBy].localeCompare(a[orderBy]) > 0) {
      return 1;
    }
    return 0;
  }
  else{
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    else if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
}

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const createData = (songObj) => {
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
};
function EnhancedTableHeader(props) {
  const { order, orderBy, onRequestSort } = props;

  const headerCells = [
    {
      id: "songname",
      displayLabel: "Song Name",
    },
    { id: "artists", displayLabel: "Artist(s)" },
    { id: "album", displayLabel: "Album" },
    { id: "acousticness", displayLabel: "Acousticness" },
    { id: "danceability", displayLabel: "Danceability" },
    { id: "energy", displayLabel: "Energy" },
    { id: "instrumentalness", displayLabel: "instrumentalness" },
    { id: "liveness", displayLabel: "Liveness" },
    { id: "loudness", displayLabel: "Loudness" },
    { id: "speechiness", displayLabel: "Speechiness" },
    { id: "valence", displayLabel: "Valence" },
    { id: "tempo", displayLabel: "Tempo" },
  ];
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headerCells.map((header) => (
          <TableCell
            key={header.id}
            sortDirection={orderBy === header.id ? order : false}
            align="right"
          >
            <TableSortLabel
              active={orderBy === header.id}
              direction={orderBy === header.id ? order : "asc"}
              onClick={createSortHandler(header.id)}
            >
              {header.displayLabel}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function SongTable(props) {
  const [rows, setRows] = React.useState(
    props.songList.map( (songObj) => {
      return createData(songObj);
  }));
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("songname");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Paper>
      <TableContainer style={{ maxHeight: "80vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <TableRow hover key={row.songname}>
                <TableCell align="right" component="th" scope="row">
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
