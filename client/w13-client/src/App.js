import "./App.css"
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import Playlists from "./components/Playlists";
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:3000");

function App() {

  return (
    <div className="App">
        <div className="container">
            <div className="row">
                <div id="navbar" className="col-2">
                    <Navbar/>
                    <div className='col'>
                        <Playlists/>
                    </div>
                </div>
                <div className="col" style={{backgroundColor:"#1c1c1c", minHeight:"100vh"}}>
                    <MainContent/>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
