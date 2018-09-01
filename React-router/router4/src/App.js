import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import { Prompt } from 'react-router';
import Child1 from './Child1';
import Child2 from './Child2';
import Child from './Child';

class App extends Component {
  render() {
    console.log(this.props)
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
            <Route path={`/child1/:id(\\d+)`}   component={Child1}></Route>
            <Route path='/child' exact component={Child}></Route>
            <Route path='/child' exact children={({match}) => {console.log(match);return null}}></Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
