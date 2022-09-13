import React from 'react';

class Albums extends React.Component {
    constructor(props) {
        super(props);

        //Setting initial state
        this.state = {
            release_data: [],
            isLoading: true,
            dataJSX:[]
        };
    }

    async componentDidMount() {
        //TODO get playlist ID
        const url = 'http://localhost:8000/playlists/';
        const response = await fetch(url);
        const data = await response.json();
        this.setState({release_data: data, isLoading: false
        }, ()=>{this.setState({dataJSX:this.setDataJSX()})});
    }

    setDataJSX = () => {
        //Setting data
        const data = this.state.release_data;

        let table_data = data.map((item) => {
            return (
                <tbody key='tableData'><tr key={item.release_id}>
                    <td><div><b>{item.title} - {item.artists}</b></div>
                    <div><b>ID #</b>{item.id}</div>
                    <div><b>Genre: </b>{item.genres}</div>
                    <div><b>Year: </b>{item.year}</div>
                    <div><b>Tracklist</b></div>
                    <ol>
                        <div>{item.tracklist.map((item, index) => {
                            return <li key={index}>{item}</li>
                        })}</div>
                    </ol>
                    <div><b>URI:</b> {item.uri}</div>
                    <div><button type="button">Remove from playlist</button></div>
                </td></tr></tbody>
            )
        })
        return table_data;
    }

    render() {
        //Setting message if still loading
        if(this.state.isLoaded) {
            return <div>Loading...</div>
        }

        //Setting message if data is yet to be retrieved
        if(!this.state.release_data) {
            return<div>Waiting for data...</div>
        }

        return (
            <div style={{color:'white'}}>
                <h1>My Playlist</h1>
                <table >
                    {this.state.dataJSX}
                </table>
            </div>
        )


    }


}

export default Albums;