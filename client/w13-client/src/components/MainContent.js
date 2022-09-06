import React from 'react'
import styles from './css/MainContent.module.css'
import DiscorgsContent from './DiscorgsContent'
class MainContent extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }

    render(){
        return(<div className={styles.MainContent}>
            <div className='container'>
            <div className='row'>
                <div className='col'><DiscorgsContent/></div>
            </div>
            </div>
            </div>)
    }
}

export default MainContent;