import React from "react";
import "./Playlists.css";

class Playlists extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      currentClicked: null,
    };
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
  }
  handlePlaylistClick(id) {
    //if the currently opened playlist is clicked, close that playlist
    if (id === this.state.currentClicked)
      this.setState({ currentClicked: null });
    else this.setState({ currentClicked: id });
  }
  createListItems() {
    var items = [];

    for (const playlist of this.props.playlists) {
      if (playlist.id !== this.state.currentClicked) {
        items.push(
          <div
            class="table-row"
            onClick={() => this.handlePlaylistClick(playlist.id)}
          >
            <div class="table-cell">{playlist.name}</div>
            <div class="table-cell">{playlist.tracks.total}</div>
            <div class="table-cell">temp</div>
          </div>
        );
      } else {
        items.push(
          <div
            class="table-row"
            onClick={() => this.handlePlaylistClick(playlist.id)}
          >
            <div class="table-cell">{playlist.name}</div>
            <div class="table-cell">{playlist.tracks.total}</div>
            <div class="table-cell">temp</div>
          </div>
        );
        items.push(
          <div class="contents-div">I CAN PUT WHATEVER I WANT IN HERE!</div>
        );
      }
    }
    return items;
  }
  render() {
    // const listItems = this.props.playlists.map((playlist) => (
    //   <div class="table-row">
    //     <div class="table-cell">{playlist.name}</div>
    //     <div class="table-cell">{playlist.tracks.total}</div>
    //     <div class="table-cell">temp</div>
    //   </div>
    // ));
    const listItems = this.createListItems();
    return (
      <div class="main-wrapper">
        <section class="table-wrapper">
          <div class="table-row">
            <div class="table-cell">Playlist Name</div>
            <div class="table-cell">Number of Songs</div>
            <div class="table-cell">Temp (Last updated maybe)</div>
          </div>
          {listItems}
        </section>
      </div>
    );
  }
}

export default Playlists;
