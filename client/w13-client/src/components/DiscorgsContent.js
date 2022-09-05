import React from 'react'
import styles from './css/DiscorgsContent.module.css'
class DiscorgsContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inputText:"",
            isLoaded:true,
            data:[],
            albumsJSX:[]
        }
    }


    async componentDidUpdate(prevProps, prevState){
        let url = "https://api.discogs.com/database/search?q="+this.state.inputText+"&format='album'&key=VUOrRLOIOnctmQdwiGKg&secret=YscHuQtQIOwyYKJapjStsQOKtQIfGNvF";
        try{
            if(prevState.inputText !== this.state.inputText){
                this.setState({isLoaded:false})
            }
            const response = await fetch(url)
            const json = await response.json();
            if(this.state.data.length === 0){
                this.setState({
                    data:json,
                    isLoaded:true,
                }, ()=>{
                    this.setState({albumsJSX:this.updateAlbumsJSX()})
                });
            }else if(prevState.inputText !== this.state.inputText){
                this.setState({
                    data:json,
                    isLoaded:true,
                }, ()=>{
                    this.setState({albumsJSX:this.updateAlbumsJSX()})
                });
                
            }
        }catch(e){
            console.error(e)
        }
    }

    handleSearch = (event) => {
        this.setState({inputText:event.target.value})
    }

    updateAlbumsJSX = () =>{
        if(this.state.data.results !== undefined){
            this.setState({albumsJSX:[]})
            let albumJSXArray = []
            albumJSXArray.push(<b key={0}><h3 key={1}>Exploring {this.state.inputText}</h3></b>)
            for (let i = 0; i < this.state.data.results.length; i++) {
                const result = this.state.data.results[i];
                albumJSXArray.push(<div style={{margin:"5% 0 5% 0"}}  key={result.id} className='col-3'>
                    <div className='container'>
                        <div className='row'><img src={result.thumb} alt={result.title}/></div>
                        <div className='row'>{result.title}</div>
                    </div>
                </div>)
            }
            return albumJSXArray;
        }else{
            return (<p>We couldn't find anything in the Discogs database matching your search criteria</p>);
        }
    }
    
    render(){
        return(<div className={styles.DiscorgsContent}>
            <div className='container'>
            <div className='row'>
                <div className='col-10 offset-1'>
                    <div><input value={this.state.inputText} className='form-control' type="text" placeholder='Search...' onChange={this.handleSearch} style={{margin:"3% 0% 3% 0%"}}/></div>
                    <div id="album-container" className='container'>
                        <div id="album-container" className='row'>
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