import React from 'react';
import connect from './connect.js';
import FunctionalComponent from './FunctionalComponent';

class App extends React.Component {

  render() {
    return (
      <div onClick={this.props.add}>
        context is :
        {this.props.todos.length}
        <br />
        渲染次数：{this.props.renderCounts}

        <FunctionalComponent></FunctionalComponent>
      </div>
    )
  }
}

export default connect(
  state => ({ todos: state.todos }),
  dispatch => {
    return {
      add: () => {
        dispatch({ type: 'ADD_TODO', text: '123' })
      }
    }
  },
  undefined,
  {
    withRef: true,
    renderCountProp: 'renderCounts', //组件props中将含有renderCounts属性，其值为组件的重复渲染次数
    storeKey: 'store'
  }
)(App);