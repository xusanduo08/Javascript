import React from 'react';
import {reduxContext} from './reduxContext';

class Provider extends React.Component{
    componentDidMount(){
        this.props.store.subscribe(()=>this.setState({}));
    }
    render(){
        const state = this.props.store.getState();
        return (
        	<reduxContext.Provider value={{state}}>
                {this.props.children}
            </reduxContext.Provider>
        )
    }
}

export default Provider;