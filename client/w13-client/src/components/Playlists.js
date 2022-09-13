import React from "react";

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    //Setting initial state
    this.state = {
      isLoading: true,
      dataJSX: <div className="row">Loading ...</div>,
      statusMessage: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.savedPlaylists !== prevState.savedPlaylists) {
      return { savedPlaylists: nextProps.savedPlaylists };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.savedPlaylists !== this.state.savedPlaylists) {
      this.updateDataJSX();
    }
  }

  handleOnClickRemovePlaylist = async (event) => {
    let playlistId = event.currentTarget.children.item(0).value;
    let url = "http://localhost:8000/playlists/" + playlistId;
    let response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
    });
    //let json = await response.json();
    if (response.status === 200) {
      this.props.setSavedPlaylists([]);
    }
  };

  updateDataJSX() {
    let jsx = [];
    this.state.savedPlaylists.map((playlist) => {
      jsx.push(
        <div className="row" key={playlist.name + playlist.id}>
          <div className="col-10">{playlist.name}</div>
          <div className="col-2">
            <button
              onClick={(event) => {
                this.handleOnClickRemovePlaylist(event);
              }}
              style={{ color: "white", border: "none", background: "none" }}
            >
              <input type="hidden" name="id" value={playlist.id} />x
            </button>
          </div>
        </div>
      );
      return true;
    });
    this.setState({ dataJSX: jsx });
  }

  render() {
    return (
      <div style={{ color: "white" }}>
        <h3 style={{ margin: "5% 0 5% 0" }}>My Playlist</h3>
        <div className="container">{this.state.dataJSX}</div>
      </div>
    );
  }
}

export default Playlist;
