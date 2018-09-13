import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from './logo.svg';
import './App.css';
import {Popover} from 'antd';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    const content = (
        <div>
          <p>Content</p>
          <p>Content</p>
        </div>
      );
      
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Popover content={content} title="Title">
            <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
            </p>
        </Popover>
        <Link to='/child1'>Child1</Link>
        <Link to='/child2'>Child2</Link>
        {this.props.children}
      </div>
    );
  }
}

export default App;
