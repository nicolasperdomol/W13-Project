import React from 'react';

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        //Setting initial state
        this.state = {
            playlists: [],
            isLoading: true,
            dataJSX:[]
        };
    }

    async componentDidMount() {
        const url = 'http://localhost:8000/playlists';
        const response = await fetch(url);
        const data = await response.json();
        this.setState({playlists: data, isLoading: false
        }, ()=>{this.setState({dataJSX: this.setDataJSX()})});
    }

    setDataJSX = () => {
        //Setting data
        const data = this.state.playlists;
        return (
            data.map((item, index) => {
                return <li key={index}>{item.name}</li>
            })
        );
        // let list = () => {
        //     return (
        //             <ol>
        //                 <div>{data.map((item, index) => {
        //                     return <li key={index}>{item.name}</li>
        //                 })}</div>
        //             </ol>
        //     )
        // }
        // return list;
    }

    render() {
        //Setting message if still loading
        if(this.state.isLoaded) {
            return <div>Loading...</div>
        }

        //Setting message if data is yet to be retrieved
        if(!this.state.playlists) {
            return<div>Waiting for data...</div>
        }

        return (
            <div style={{color:'white'}}>
                <h1>My Playlist</h1>
                <ul>{this.state.dataJSX}</ul>
            </div>
        )


    }


}

export default Playlist;