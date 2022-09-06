import "./App.css"
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
function App() {
  return (
    <div className="App">
        <div className="container">
            <div className="row">
                <div id="navbar" className="col-2">
                    <Navbar/>
                    <div className='col'>My playlist</div>
                </div>
                <div className="col" style={{backgroundColor:"#1c1c1c"}}>
                    <MainContent/>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
