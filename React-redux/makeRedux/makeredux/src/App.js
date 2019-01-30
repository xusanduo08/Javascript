import React, { Component } from 'react';
import Title from './Title.js';
import Content from './Content.js';
import './App.css';
import {storeContext} from './store';

class App extends Component {

    componentDidUpdate(){
        console.log('App didUpdate');
        this.props.store.subscribe(()=>this.setState({}));
    }

    render(){
        const state =this.props.store.getState();
        console.log(state);
        return (
            <storeContext.Provider value={{state, store: this.props.store}}>
                <div>
                    <Title />
                    <Content />
                </div>
            </storeContext.Provider>
        )
    }
}

export default App;
