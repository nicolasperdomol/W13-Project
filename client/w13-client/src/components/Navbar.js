import React from 'react'
import styles from './css/Navbar.module.css'
class Navbar extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }

    render(){
        return(<div className={styles.Navbar}>
            <div className='container'>
            <div className='row'>
                <div className='col'>Navbar</div>
            </div>
            </div>
            </div>)
    }
}

export default Navbar;