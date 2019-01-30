import React, { Component } from 'react';
import { storeContext } from './store.js';
import connect from './connect';

class Content extends Component {
  constructor() {
    super();
    this.state = {
      content: {}
    }
  }
  
  render() {
    return (
      <div id='content'>
        {this.props.content.text}
      </div>
    )
  }
}

export default connect(storeContext,Content);