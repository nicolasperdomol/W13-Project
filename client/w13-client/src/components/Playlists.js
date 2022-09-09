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
        try {
            const url = 'http://localhost:8000/playlists';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            this.setState({playlists: data, isLoading: false
            }, ()=>{this.setState({dataJSX: this.setDataJSX()})});
        } catch (error) {
            console.log(error);
        }
    }

    setDataJSX = () => {
        //Setting data
        const data = this.state.playlists;
        return (
            data.map((item, index) => {
                let link = 'http://localhost:8000/playlists/' + item.id;
                return <li key={index}><a href={link}>{item.name}</a></li>
            })
        );
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