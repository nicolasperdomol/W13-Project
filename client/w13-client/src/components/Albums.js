import React from "react";
import addMusicImage from "../imgs/addMusic.svg";
import style from "./css/AlbumsContent.module.css";

class Albums extends React.Component {
  constructor(props) {
    super(props);

    //Setting initial state
    this.state = {
      playlist_data: [],
      isLoading: true,
      dataJSX: [],
      message: "",
      playlistId: this.props.playlistId, //TODO get playlist ID
    };
  }

  componentDidMount() {
    this.getData();
  }

  //If playlist length have changed, the state is updated
  componentDidUpdate(prevProps, prevState) {
    if (prevState.playlist_data.length !== this.state.playlist_data.length) {
      this.getData();
    }
  }

  getData = async () => {
    let playlistId = this.state.playlistId;
    let url = "http://localhost:8000/playlists/" + playlistId;
    let response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });
    if (response.status === 200) {
      let data = await response.json();
      //console.log(data);
      this.setState({
        playlist_data: data,
        isLoading: false,
        dataJSX: this.setDataJSX(),
        message: "",
      });
    } else {
      this.setState({ dataJSX: this.setDataJSX() });
      //console.log(response.statusText);
    }
  };

  handleOnImageClick = async () => {
    console.log("Redirecting to search page"); //TODO redirect page
  };

  handleOnDeleteAlbum = async (event) => {
    let albumId = event.target.value;
    let playlistId = this.state.playlistId;
    let url = "http://localhost:8000/playlists/" + playlistId + "/" + albumId;
    let response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
    });
    if (response.status === 200) {
      //console.log(response);
      this.setState({ message: "Album removed!" }); //TODO get response msg
    } else {
      //console.log(response.statusText);
    }
  };

  setDataJSX = () => {
    //Setting data
    const data = this.state.playlist_data;
    //console.log(data);
    let content = [];
    if (data.length === 0 || data === null) {
      content = (
        <div>
          <img
            src={addMusicImage}
            alt="add music"
            title="Add music"
            className={style.img}
            onClick={() => this.handleOnImageClick()}
          />
        </div>
      );
      this.setState({
        message: "Playlist is empty... Add some music!",
        dataJSX: content,
      });
    } else {
      content = data.map((item) => {
        return (
          <tbody key="tableData">
            <tr key={item.release_id}>
              <td>
                <img src={item.image_url} alt={item.artists} />
                <div>
                  <b>
                    {item.title} - {item.artists}
                  </b>
                </div>
                <div>
                  <b>ID #</b>
                  {item.release_id}
                </div>
                <div>
                  <b>Genre: </b>
                  {item.genres}
                </div>
                <div>
                  <b>Year: </b>
                  {item.year}
                </div>
                <div>
                  <b>Tracklist</b>
                </div>
                <ol>
                  <div>
                    {item.tracklist.map((item, index) => {
                      return <li key={index}>{item}</li>;
                    })}
                  </div>
                </ol>
                <div>
                  <b>URI:</b> {item.uri}
                </div>
                <div>
                  <button
                    value={item.release_id}
                    onClick={(event) => {
                      this.handleOnDeleteAlbum(event);
                    }}
                  >
                    Remove from playlist
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        );
      });
    }

    return content;
  };

  render() {
    //Setting message if still loading
    if (this.state.isLoaded) {
      return <div>Loading...</div>;
    }

    //Setting message if data is yet to be retrieved
    if (!this.state.playlist_data) {
      return <div>Waiting for data...</div>;
    }

    return (
      <div style={{ color: "white" }}>
        <button
          onClick={() => {
            this.props.setPlaylistId(0);
          }}
        >
          return
        </button>
        <h1>My Playlist</h1>
        <p>{this.state.message}</p>
        <table>{this.state.dataJSX}</table>
      </div>
    );
  }
}

export default Albums;
