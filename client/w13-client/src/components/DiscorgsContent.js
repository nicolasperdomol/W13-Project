import React from 'react'
import styles from './css/DiscorgsContent.module.css'
import jazzBandIMG from '../imgs/jazzBand.svg'
import {DiscorgsContentModes as modes} from './componentEnums'
class DiscorgsContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inputText:"",
            isLoaded:true,
            mode:modes.MultipleAlbums,
            data:[],
            albumsJSX:(<div className='col' style={{padding:"10%"}}><h1 className='text-center'>What do you want to listen to?</h1><img src={jazzBandIMG} alt="jazz band" /></div>)
        }
    }


    async componentDidUpdate(prevProps, prevState){
        //TODO: See if I can access to the content without sending the key in the URL.
        let url = "https://api.discogs.com/database/search?q="+this.state.inputText+"&format='album'&key=VUOrRLOIOnctmQdwiGKg&secret=YscHuQtQIOwyYKJapjStsQOKtQIfGNvF";
        try{
            if(this.state.data.length === 0){
                const response = await fetch(url)
                const json = await response.json();
                this.setState({
                    data:json,
                    isLoaded:true,
                }, ()=>{
                    this.setState({albumsJSX:this.updateAlbumsJSX()})
                });
            }else if(prevState.inputText !== this.state.inputText){
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
        
        let url = "https://api.discogs.com/masters/" + masterId;
        try {
            const response = await fetch(url)
            const json = await response.json();
            this.setState({
                data:json,
                mode:modes.SingleAlbum,
            })

        } catch (e) {
            console.error(e);
        }
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
                        <button key={"albumsContainer"} style={{border:"none", backgroundColor:"transparent", color:"white"}} onClick={(event)=>{this.handleOnClickAlbum(event)}}><div className='container'>
                            <input id="masterId" type="hidden" value={result.master_id}/>
                            <div className='row'><img src={result.thumb} alt={result.title} onError={(event)=>{event.target.src = "https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png"}}/></div>
                            <div className='row text-justify' style={{marginTop:'10%'}}><b>{result.title}</b></div>
                        </div></button>
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

    updateAlbumsJSX = () =>{
        switch (this.state.mode) {
            case modes.MultipleAlbums:
                return this.multipleAlbumsJSX()

            case modes.SingleAlbum:
                this.setState({albumsJSX:[]})
                return (<div>Hola mundo</div>)

            default:
                return (<div></div>)
        }
        
    }
    
    render(){
        return(<div className={styles.DiscorgsContent}>
            <div className='container'>
            <div className='row'>
                <div className='col-10 offset-1'>
                    <div><input value={this.state.inputText} className='form-control' type="text" placeholder='Search...' onChange={this.handleSearch} style={{margin:"3% 0% 3% 0%"}}/></div>
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