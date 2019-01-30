import React, { Component } from 'react';
import connect from './connect';

class Content extends Component {
  componentDidUpdate(){
      console.log('content didUpdate')
  }
  
  render() {
    return (
      <div id='content'>
        {this.props.content.text}
      </div>
    )
  }
}

export default connect(Content);