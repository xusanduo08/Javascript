import React, { Component } from 'react';
import {storeContext} from './store.js';

class Content extends Component{
  constructor(){
    super();
    this.state = {
      content:{}
    }
  }
    componentDidMount(){
      this.context.store.subscribe(() => { //  从上下文获取store
        this.setState({}); // 订阅store，数据有变化时，发起re-render
      })
      this.setState({content: this.context.store.getState().content})
    }
    componentDidUpdate(){
      console.log('Content didUpdate');
      this.setState({content: this.context.store.getState().content})
    }
    shouldComponentUpdate(nextProps, nextState){
      debugger;
      const {content} = nextState;
      const nextContent = this.context.store.getState().content;
      if(content.text !== nextContent.text || content.color !== nextContent.color){
        return true;
      }
      return false;
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