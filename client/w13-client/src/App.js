import "./App.css"
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import Playlists from './components/Playlists'
import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);

        //Setting initial state
        this.state = {
            savedPlaylists: [],
            loading: true,
        };
    }

    getSavedPlaylists = async()=>{
        let url = "http://localhost:8000/playlists"
        let response = await fetch(url);
        let json = await response.json();
        this.setState({savedPlaylists:json, loading:false})
    }

    componentDidMount(){
        this.getSavedPlaylists();
    }
    
   render(){
    return (
    <div className="App">
        <div className="container">
            <div className="row">
                <div id="navbar" className="col-2">
                    <Navbar/>
                    <div className='col'>
                        <Playlists savedPlaylists={this.state.savedPlaylists}/>
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
}

export default App;
