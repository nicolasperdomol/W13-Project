import React from "react";

export default class FetchData extends React.Component {
    state = {
        loading: true,
        release: null
    };


    async componentDidMount() {
        const url = "http://localhost:8000/playlist";
        const response = await fetch(url);
        const data = await response.json();
        this.setState({loading: false, release: data});
    }

    render() {
        
        if (this.state.loading) {
            return <div>Loading...</div>
        }

        if (!this.state.release) {
            return <div>No data...</div>
        }

        return (
            <div>
                <div>
                    <div>this.state.release.title</div>
                    <div>this.state.release.artist</div>
                </div>

            </div>
        )
    }

}