import "./App.css";
import Playlists from "./components/Playlists";
import DiscorgsContent from "./components/DiscorgsContent";
import React, { useEffect, useState } from "react";
import Albums from "./components/Albums";

function App() {
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  useEffect(() => {
    //Set async function
    const getSavedPlaylists = async () => {
      let url = "http://localhost:8000/playlists";
      try {
        let response = await fetch(url);
        let json = await response.json();

        if (savedPlaylists.length !== json.length) {
          setSavedPlaylists(json);
        }
      } catch (e) {
        console.error(e);
      }
    };

    //Call async function
    getSavedPlaylists();
  }, [savedPlaylists]);

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div id="navbar" className="col-2">
            <div className="col">
              <Playlists
                savedPlaylists={savedPlaylists}
                setSavedPlaylists={setSavedPlaylists}
              />
            </div>
          </div>
          <div
            className="col"
            style={{
              backgroundColor: "#1c1c1c",
              minHeight: "100vh",
              color: "white",
            }}
          >
            <div className="container">
              <div className="row">
                <div className={"col DiscorgsContent"}>
                  <DiscorgsContent
                    savedPlaylists={savedPlaylists}
                    setSavedPlaylists={setSavedPlaylists}
                  />
                  {/* <Albums playlistId={16}/> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
