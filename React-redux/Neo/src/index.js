import React, { Children, Component } from 'react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import todo from './reducer.js';
//import connect from '../src/connect';
import {connect} from 'react-redux';

//用来测试Connect1中含有子组件Connect2的情况

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


const store = createStore(() => {
  return {}
})
let mapStateToPropsCalls = 0

let linkA, linkB

let App = ({ children, setLocation }) => {
  const onClick = to => event => {
    event.preventDefault()
    setLocation(to)
  }
  /* eslint-disable react/jsx-no-bind */
  return (
    <div>
      <a href="#" onClick={onClick('a')} ref={c => { linkA = c }}>A</a>
      <a href="#" onClick={onClick('b')} ref={c => { linkB = c }}>B</a>
      {children}
    </div>
  )
  /* eslint-enable react/jsx-no-bind */
}
App = connect(() => ({}))(App)


class A extends Component{
  componentWillUnmount(){
    console.log(33)
  }
  componentDidMount(){
    
  }
  render(){
    return (<h1>A</h1>)
  }
}
A = connect(() => {
  console.log(++mapStateToPropsCalls)
  return { calls: mapStateToPropsCalls }
})(A)


const B = () => (<h1>B</h1>)


class RouterMock extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = { location: { pathname: 'a' } }
    this.setLocation = this.setLocation.bind(this)
  }

  setLocation(pathname) {
    this.setState({ location: { pathname } })
    store.dispatch({ type: 'TEST' })
  }

  getChildComponent(location) {
    switch (location) {
      case 'a': return <A />
      case 'b': return <B />
      default: throw new Error('Unknown location: ' + location)
    }
  }

  render() {
    return (<App setLocation={this.setLocation} name='app'>
      {this.getChildComponent(this.state.location.pathname)}
    </App>)
  }
}


const div = document.createElement('div')
document.body.appendChild(div)
ReactDOM.render(
  (<ProviderMock store={store}>
    <RouterMock />
  </ProviderMock>),
  div
)
// linkA.click()
// linkB.click()
// linkB.click()
//document.body.removeChild(div)