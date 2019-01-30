import React, { Component } from 'react';
import Title from './Title.js';
import Content from './Content.js';
import './App.css';

class App extends Component {
    componentDidUpdate(){
        console.log('App didUpdate');
    }
    render(){
        
        return (
            <div>
                <Title />
                <Content />
            </div>
        )
    }
}

export default App;
