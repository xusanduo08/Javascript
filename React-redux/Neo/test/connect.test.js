import React, { Children, Component } from 'react'
import createClass from 'create-react-class'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import TestRenderer from 'react-test-renderer'
import { createStore } from 'redux'
import connect from '../src/connect'

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

  it('should invoke mapDispatch every time props are changed if it has zero arguments', () => {
    const store = createStore(stringBuilder)

    let invocationCount = 0

    @connect(null, () => {
      invocationCount++
      return {}
    })

    class WithoutProps extends Component {
      render() {
        return <Passthrough {...this.props}/>
      }
    }

    class OuterComponent extends Component {
      constructor() {
        super()
        this.state = { foo: 'FOO' }
      }

      setFoo(foo) {
        this.setState({ foo })
      }

      render() {
        return (
          <div>
            <WithoutProps {...this.state} />
          </div>
        )
      }
    }

    let outerComponent
    TestRenderer.create(
      <ProviderMock store={store}>
        <OuterComponent ref={c => outerComponent = c} />
      </ProviderMock>
    )

    outerComponent.setFoo('BAR')
    outerComponent.setFoo('DID')

    expect(invocationCount).toEqual(3)
  })

  

  

})