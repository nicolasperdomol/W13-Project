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
                </div>
                <div className="col-10">
                    <MainContent/>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
