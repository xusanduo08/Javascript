/*
    Provider主要功能就是提供一个含有store的上下文给子组件。
*/

import React from 'react';
import PropTypes from 'prop-types';

//换了一种写法，是的Provider实例化时可以传入参数
function createProvider(storeKey = 'store'){
  const subscriptionKey = `${storeKey}Subscription`;
  class Provider extends React.Component {

    getChildContext() {
      return {
        [storeKey]: this.props.store
      }
    }
    render() {
      return React.Children.only(this.props.children)
    }
  }
  
  Provider.childContextTypes = {
    [storeKey]: PropTypes.object
  }
  return Provider;
}



export default createProvider;