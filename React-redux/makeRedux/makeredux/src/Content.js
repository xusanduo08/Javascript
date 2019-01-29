import React, { Component } from 'react';
import {storeContext} from './store.js';

class Content extends Component{
    componentDidMount(){
      this.context.store.subscribe(() => { //  从上下文获取store
        this.setState({}); // 订阅store，数据有变化时，发起re-render
      })
    }
    componentDidUpdate(){
      console.log('Content didUpdate');
    }
    render(){
        return (
        	<div id='content'>
              {this.context.store.getState().content.text}
          </div>
        )
    }
}
Content.contextType = storeContext;
export default Content;