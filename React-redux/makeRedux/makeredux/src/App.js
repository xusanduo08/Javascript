import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render(){
        return (
            <div>
                <div id = 'title'>{this.props.book.title.text}</div>
           		<div id = 'content'>{this.props.book.content.text}</div>
             </div>
        )
    }
}

export default App;
