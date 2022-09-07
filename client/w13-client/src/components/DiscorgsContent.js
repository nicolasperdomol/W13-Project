/* eslint-disable jsx-a11y/role-has-required-aria-props */
import React from 'react'
import styles from './css/DiscorgsContent.module.css'
import jazzBandIMG from '../imgs/jazzBand.svg'
import {DiscorgsContentModes as modes} from './componentEnums'
class DiscorgsContent extends React.Component{
    /**
     * @param {*} props Properties of React component
     * @property {string} inputText Text typed by the user in the search bar client application.
     * @property {boolean} isLoaded Indicates if the app did received all the data from a previous fetch or not.
     * @property {array} data Holds the information retrieved from a fetch request as JSON.
     * @property {JSX} albumsJSX Main source of what we will display to the user, depends on [data] and [mode].
     * @property {enum} mode Affects albumsJSX in the way we will display the information [MultipleAlbums: in a grid with 4 columns / SingleAlbum: col-12 full width of the page]
     * @property {string} additionalMedia Images and other relevant data that are not found in the new data.
     */
    constructor(props){
        super(props);
        this.state = {
            inputText:"",
            isLoaded:true,
            data:[],
            albumsJSX:(<div className='col' style={{padding:"10%"}}><h1 className='text-center'>What do you want to listen to?</h1><img src={jazzBandIMG} alt="jazz band" /></div>),
            mode:modes.MultipleAlbums,
            filter:"artist",
            additionalMedia:[]
        }
    }


    async componentDidUpdate(prevProps, prevState){
        //TODO: Modify API access, get token and info without sending the key in the URL.
        let url = "https://api.discogs.com/database/search?artist='"+this.state.inputText+"'&key=VUOrRLOIOnctmQdwiGKg&secret=YscHuQtQIOwyYKJapjStsQOKtQIfGNvF";
        if(this.state.filter === "album"){
            url = "https://api.discogs.com/database/search?q='"+this.state.inputText+"'&format='album'&key=VUOrRLOIOnctmQdwiGKg&secret=YscHuQtQIOwyYKJapjStsQOKtQIfGNvF";
        }
        try{
            let isDataStateEmpty = this.state.data.length === 0;
            let hasInputTextChanged = prevState.inputText !== this.state.inputText;
            let isEmptyInputText = this.state.inputText.length !== 0;
            //Runs the first time asign JSON to data.
            if(isDataStateEmpty && isEmptyInputText){
                const response = await fetch(url)
                const json = await response.json();
                this.setState({
                    data:json,
                    isLoaded:true,
                }, ()=>{
                    //Runs only AFTER this.setState has finished, similar to await this.setState
                    this.setState({albumsJSX:this.updateAlbumsJSX()})
                });
            }else if(hasInputTextChanged){
                if(this.state.mode !== modes.MultipleAlbums){
                    //If the user type something different in the search bar, set mode to multiple albums
                    this.setState({mode:modes.MultipleAlbums});
                }
                this.setState({isLoaded:false})
                const response = await fetch(url)
                const json = await response.json();
                this.setState({
                    data:json,
                    isLoaded:true,
                }, ()=>{
                    this.setState({albumsJSX:this.updateAlbumsJSX()})
                });
            } else if(prevState.mode !== this.state.mode){
                this.setState({albumsJSX:this.updateAlbumsJSX()})
            }
        }catch(e){
            console.error(e)
        }
    }

    /**
     * 
     * @param {object} event 
     */
    handleSearch = (event) => {
        this.setState({inputText:event.target.value})
    }

    handleOnMouseOverAlbum = (event) =>{
        event.currentTarget.style="background-color:#2b2b2b; margin:5% 0 5% 0"
    }

    handleOnMouseOutAlbum = (event) =>{
        event.currentTarget.style="background-color:#1c1c1c; margin:5% 0 5% 0"
    }

    handleOnClickAlbum = async(event) =>{
        let masterId = event.currentTarget.children.item(0).children.item(0).value;  // Button >> Div >> Input.value
        let thumbSource = event.currentTarget.children.item(0).children.item(1).children.item(0).src; //Button >> Div >> Div >> Image >> Src
        
        let url = "https://api.discogs.com/masters/" + masterId;
        try {
            const response = await fetch(url)
            const json = await response.json();

            this.setState({
                data:json,
                mode:modes.SingleAlbum,
                additionalMedia: {image:thumbSource}
            })

        } catch (e) {
            console.error(e);
        }
    }

    handleOnChangeFilter = (event) =>{
        this.setState({filter:event.target.value})
    }

    handleOnClickAddAlbum = (event) =>{
        console.log(event.currentTarget.children.item(0))
    }

    multipleAlbumsJSX = () =>{
        if(this.state.data.results !== undefined){
            this.setState({albumsJSX:[]})
            let albumJSXArray = []
            const uniqueMaster = {};
            albumJSXArray.push(<b key="Bold Exploring"><h3 key="Exploring" style={{marginTop:"2%"}}>Exploring {this.state.inputText}</h3></b>)
            for (let i = 0; i < this.state.data.results.length; i++) {
                const result = this.state.data.results[i];

                if(uniqueMaster[result.master_id] === undefined){
                    //{Unique master : Has been display(false)}
                    uniqueMaster[result.master_id] = false;
                }
                
                //Filtered by UNIQUE MASTER_ID
                if(uniqueMaster[result.master_id] === false){
                    albumJSXArray.push(<div style={{margin:"5% 0 5% 0"}}  key={result.id} className='col-3' onMouseOver={(event)=>{this.handleOnMouseOverAlbum(event)}} onMouseOut={(event)=>{this.handleOnMouseOutAlbum(event)}}>
                        <div role={"button"} key={"albumsContainer"} style={{border:"none", backgroundColor:"transparent", color:"white"}} onClick={(event)=>{this.handleOnClickAlbum(event)}}><div className='container'>
                            <input id="masterId" type="hidden" value={result.master_id}/>
                            <div className='row'>
                                <img style={{maxWidth:"171px", maxHeight:"171px"}} src={result.thumb} alt={result.title} onError={(event)=>{event.target.src = "https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png"}}/>
                                <button id="addAlbum" className='btn btn-success' style={{borderRadius:"100%", width:"40px", height:"40px", position:"absolute"}} onClick={(event)=>{event.stopPropagation(); this.handleOnClickAddAlbum(event)}}>+<input type="hidden" name='master_id' value={result.master_id} /></button>
                            </div>
                            <div className='row text-justify' style={{marginTop:'10%'}}><b>{result.title}</b></div>
                        </div></div>
                    </div>)

                    //Unique master was display
                    uniqueMaster[result.master_id] = true;
                }
            }
            return albumJSXArray;
        }else{
            return (<p>Loading . . .</p>);
        }
    }

    singleAlbumJSX = () =>{
        let tracklist = []
        let index = 1;
        if(this.state.data.message !== undefined){
            return (<h3>{this.state.data.message}</h3>)
        }

        this.state.data.tracklist.forEach(track => {
            tracklist.push(<div className='container' style={{marginTop:"0.5%"}} key={track.title+index}><div className='row'><div className='col-1'>{index}</div><div className='col'><b>{track.title}</b></div><div className='col-1 align-self-end'>{track.duration}</div></div></div>)
            index++;
        });

        return (<><div className='col-3'><img src={this.state.additionalMedia.image} alt="Album cover" /></div>
        <div className='col-9' style={{marginBottom:"9%"}}><div className='container'><div className='row'>album</div><div className='row'>
            <b style={{padding:"0"}}><h1>{this.state.data.title}</h1></b>
            <div style={{padding:"0"}}>{this.state.data.artists[0] !== undefined ? this.state.data.artists[0].name : ""}</div>
            </div></div></div>
            <div className='container'><div className='row'>
                <div className='container'><div className='row'>
                    {tracklist}
                </div></div>
            </div></div></>)
    }

    updateAlbumsJSX = () =>{
        switch (this.state.mode) {
            case modes.MultipleAlbums:
                return this.multipleAlbumsJSX();

            case modes.SingleAlbum:
                this.setState({albumsJSX:[]})
                return this.singleAlbumJSX();

            default:
                return (<div></div>)
        }
        
    }
    
    render(){
        return(<div className={styles.DiscorgsContent}>
            <div className='container'>
            <div className='row'>
                <div className='col-10 offset-1'>
                    <div className='container'>
                        <div className="row" style={{marginTop:"2%"}}><input value={this.state.inputText} className='form-control' type="text" placeholder='Search...' onChange={this.handleSearch}/></div>
                        <div className='row' style={{margin:"3% 0% 3% 0%"}}>
                        <div className='col-1'>Filters: </div>
                        <div className="col form-check form-switch">
                            <div className='container'><div className='row'>
                                <label id="artistLabel" className='col-2'>By artist<input name="filter" className="form-check-input" type="radio" role="switch" id="artist" value={"artist"} onChange={(event)=>{this.handleOnChangeFilter(event)}} checked={this.state.filter==="artist"}/></label>
                                <label id="albumLabel" className='col-2'>By album<input name="filter" className="form-check-input" type="radio" role="switch" id="album" value={"album"} onChange={(event)=>{this.handleOnChangeFilter(event)}} checked={this.state.filter==="album"}/></label>
                            </div></div>
                            
                        </div>
                    </div></div>
                    <div id="album-container" className={"container " + this.state.isLoaded?" opacity-100":"opacity-50"}>
                        <div id="album-row" className='row'>
                            {this.state.albumsJSX}
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>)
    }
}

export default DiscorgsContent;