import React, { Children, Component } from 'react'
import createClass from 'create-react-class'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import TestRenderer from 'react-test-renderer'
import { createStore } from 'redux'
import connect from '../src/connect'
import createProvider from '../src/Provider';

describe('connect', () => {
  class Passthrough extends Component {
    render() {
      return <div />
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

  class ContextBoundStore {
    constructor(reducer) {
      this.reducer = reducer
      this.listeners = []
      this.state = undefined
      this.dispatch({})
    }

    getState() {
      return this.state
    }

    subscribe(listener) {
      this.listeners.push(listener)
      return (() => this.listeners.filter(l => l !== listener))
    }

    dispatch(action) {
      this.state = this.reducer(this.getState(), action)
      this.listeners.forEach(l => l())
      return action
    }
  }

  function stringBuilder(prev = '', action) {
    return action.type === 'APPEND'
      ? prev + action.body
      : prev
  }

  function imitateHotReloading(TargetClass, SourceClass, container) {
    // Crude imitation of hot reloading that does the job
    Object.getOwnPropertyNames(SourceClass.prototype).filter(key =>
      typeof SourceClass.prototype[key] === 'function'
    ).forEach(key => {
      if (key !== 'render' && key !== 'constructor') {
        TargetClass.prototype[key] = SourceClass.prototype[key]
      }
    })

    container.forceUpdate()
  }

  
  it('should not attempt to set state after unmounting', () => {
    const store = createStore(stringBuilder)
    let mapStateToPropsCalls = 0

    @connect(
      () => ({ calls: ++mapStateToPropsCalls }),
      dispatch => ({ dispatch })
    )
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const div = document.createElement('div')
    store.subscribe(() =>
      ReactDOM.unmountComponentAtNode(div)
    )
    ReactDOM.render(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>,
      div
    )

    expect(mapStateToPropsCalls).toBe(1)
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    store.dispatch({ type: 'APPEND', body: 'a' })
    spy.mockRestore()
    expect(spy).toHaveBeenCalledTimes(0)
    expect(mapStateToPropsCalls).toBe(1)
  })

})