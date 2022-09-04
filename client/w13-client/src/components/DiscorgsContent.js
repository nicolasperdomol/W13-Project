import React from 'react'
import styles from './css/DiscorgsContent.module.css'
class DiscorgsContent extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }

    render(){
        return(<div className={styles.DiscorgsContent}>
            <div className='container'>
            <div className='row'>
                <div className='col-10 offset-1'>
                    <div>Search</div>
                </div>
            </div>
            </div>
            </div>)
    }
}

export default DiscorgsContent;