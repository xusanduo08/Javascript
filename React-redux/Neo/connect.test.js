import React, { Children, Component } from 'react'
import createClass from 'create-react-class'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import TestRenderer from 'react-test-renderer'
import { createStore } from 'redux'
import connect from './src/connect'

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

  it('should receive the store in the context', () => {
    const store = createStore(() => ({}))

    @connect()
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container pass="through" />
      </ProviderMock>
    )

    const container = testRenderer.root.findByType(Container)
    expect(container.instance.context.store).toBe(store)
  })

  it('should pass state and props to the given component', () => {
    const store = createStore(() => ({
      foo: 'bar',
      baz: 42,
      hello: 'world'
    }))

    @connect(({ foo, baz }) => ({ foo, baz }))
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container pass="through" baz={50} />
      </ProviderMock>
    )
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.pass).toEqual('through')
    expect(stub.props.foo).toEqual('bar')
    expect(stub.props.baz).toEqual(42)
    expect(stub.props.hello).toEqual(undefined)
    expect(() =>
      testRenderer.root.findByType(Container)
    ).not.toThrow()
  })
})