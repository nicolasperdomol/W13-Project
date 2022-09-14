import React from "react";
import Albums from "./Albums";

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

  //If state has changed, the state will be updated
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
    let json = await response.json();
    if (response.status === 200) {
      this.props.setSavedPlaylists([]);
    }
    console.log(json);
  };

  handleOnClickPlaylist = async (event) => {
    // let playlistId = event.currentTarget.children.item(0).value;
    // let url = "http://localhost:8000/playlists/" + playlistId;
    // let response = await fetch(url, {
    //   method: "GET",
    //   mode: "cors",
    // });
    // let json = await response.json();
    // console.log(json);
    let playlistId = event.currentTarget.children.item(0).value;
    console.log(playlistId);

    return <Albums id={playlistId} />;
  };

  updateDataJSX() {
    let jsx = [];
    this.state.savedPlaylists.map((playlist) => {
      jsx.push(
        <div className="row" key={playlist.name + playlist.id}>
          <div className="col-10">
            <button
              onClick={(event) => {
                this.handleOnClickPlaylist(event);
              }}
              style={{ color: "white", border: "none", background: "none" }}
            >
              <a
                style={{ color: "white", textDecoration: "none" }}
                href={"http://localhost:8000/playlists/" + playlist.id}
              >
                {playlist.name}
              </a>
              <input type="hidden" name="id" value={playlist.id} />
            </button>
          </div>
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
    this.setState({ dataJSX: jsx, isLoading: false });
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
