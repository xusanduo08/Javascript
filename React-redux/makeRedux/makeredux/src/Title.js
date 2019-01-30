import React, { Component } from 'react';
import {storeContext} from './store.js';
import connect from './connect';


class Title extends Component {

  render() {
    return (
      <div id='title' style={{ color: this.props.title.color }}>
      {this.props.title.text}
      </div>
    )
  }
}

export default connect(storeContext,Title);