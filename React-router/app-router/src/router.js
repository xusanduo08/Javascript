import React from 'react';
import {Router, Route, browserHistory }from 'react-router';
import App from './App';
import Child1 from './Child1';
import Child2 from './Child2';

export default function() {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='child1' component={Child1}></Route>
        <Route path='child2' component={Child2}></Route>
      </Route>
    </Router>
  )
}
