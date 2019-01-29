import React, { Component } from 'react';
import {storeContext} from './store.js';


class Title extends Component {

  componentDidMount(){
    this.context.store.subscribe(() => { //  从上下文获取store
        this.setState({}); // 订阅store，数据有变化时，发起re-render
    })
  }
  componentDidUpdate(){
    console.log('Title didUpdate');
  }

  render() {
    return (
      <div id='title' style={{ color: this.context.store.getState().title.color }}>
      {this.context.store.getState().title.text}
      </div>
    )
  }
}

Title.contextType = storeContext

export default Title;