import React, { Component } from 'react';
import Title from './Title.js';
import Content from './Content.js';
import './App.css';

class App extends Component {

    componentDidUpdate(){
        console.log('App didUpdate');
    }

    shouldComponentUpdate(nextProps){
        if(this.props.book !== nextProps.book){
            return true;
        }
        return false;
    }

    render(){
        return (
            <div>
        		<Title title={this.props.book.title} />
        		<Content content={this.props.book.content} />
        	</div>
        )
    }
}

export default App;
