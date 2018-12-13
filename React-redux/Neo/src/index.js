import React, { Children, Component } from 'react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import todo from './reducer.js';
//import connect from '../src/connect';
import { connect } from 'react-redux';

function reducer(state = { data: null }, action) {
  switch (action.type) {
    case 'fetch':
      return { data: { profile: { name: 'April' } } }
    case 'clean':
      return { data: null }
    default:
      return state
  }
}

class ProviderMock extends Component {
  getChildContext() {
    return { store: this.props.store }
  }

  render() {
    return Children.only(this.props.children)
  }
}
ProviderMock.childContextTypes = {
  store: PropTypes.object.isRequired
}

class Parent extends React.Component {
  componentWillMount() {
    this.props.dispatch({ type: 'fetch' })
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'clean' })
  }

  removeDOM(){
    ReactDOM.unmountComponentAtNode(div)
  }

  render() {
    return (
      <div>
        <button onClick={this.removeDOM}>Click======</button>
        <Child name='child' />
      </div>
    )
    
  }
}
Parent = connect(null)(Parent);


class Child extends React.Component {
  render() {
    return <div>Child</div>
  }
}

Child = connect(state => ({
  profile: state.data.profile
}))(Child)

const store = createStore(reducer)
const div = document.createElement('div')
document.body.appendChild(div)
ReactDOM.render(
  <ProviderMock store={store}>
    <Parent />
  </ProviderMock>,
  div
)

