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

  it('should subscribe class components to the store changes', () => {
    const store = createStore(stringBuilder)

    @connect(state => ({ string: state }))
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>
    )

    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.string).toBe('')
    store.dispatch({ type: 'APPEND', body: 'a' })
    expect(stub.props.string).toBe('a')
    store.dispatch({ type: 'APPEND', body: 'b' })
    expect(stub.props.string).toBe('ab')
  })

  it('should subscribe pure function components to the store changes', () => {
    const store = createStore(stringBuilder)

    let Container = connect(
      state => ({ string: state })
    )(function Container(props) {
      return <Passthrough {...props} />
    })

    const spy = jest.spyOn(console, 'error').mockImplementation(() => { })
    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>
    )
    spy.mockRestore()
    expect(spy).toHaveBeenCalledTimes(0)

    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.string).toBe('')
    store.dispatch({ type: 'APPEND', body: 'a' })
    expect(stub.props.string).toBe('a')
    store.dispatch({ type: 'APPEND', body: 'b' })
    expect(stub.props.string).toBe('ab')
  })

  it('should retain the store\'s context', () => {
    const store = new ContextBoundStore(stringBuilder)

    let Container = connect(
      state => ({ string: state })
    )(function Container(props) {
      return <Passthrough {...props} />
    })

    const spy = jest.spyOn(console, 'error').mockImplementation(() => { })
    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>
    )
    spy.mockRestore()
    expect(spy).toHaveBeenCalledTimes(0)

    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.string).toBe('')
    store.dispatch({ type: 'APPEND', body: 'a' })
    expect(stub.props.string).toBe('a')
  })

  it('should handle dispatches before componentDidMount', () => {
    const store = createStore(stringBuilder)

    @connect(state => ({ string: state }))
    class Container extends Component {
      componentWillMount() {
        store.dispatch({ type: 'APPEND', body: 'a' })
      }

      render() {
        return <Passthrough {...this.props} />
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>
    )

    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.string).toBe('a')
  })

  it('should handle additional prop changes in addition to slice', () => {
    const store = createStore(() => ({
      foo: 'bar'
    }))

    @connect(state => state)
    class ConnectContainer extends Component {
      render() {
        return (
          <Passthrough {...this.props} pass={this.props.bar.baz} />
        )
      }
    }

    class Container extends Component {
      constructor() {
        super()
        this.state = {
          bar: {
            baz: ''
          }
        }
      }

      componentDidMount() {
        this.setState({
          bar: Object.assign({}, this.state.bar, { baz: 'through' })
        })
      }

      render() {
        return (
          <ProviderMock store={store}>
            <ConnectContainer bar={this.state.bar} />
          </ProviderMock>
        )
      }
    }

    const testRenderer = TestRenderer.create(<Container />)
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.foo).toEqual('bar')
    expect(stub.props.pass).toEqual('through')
  })

  it('should handle unexpected prop changes with forceUpdate()', () => {
    const store = createStore(() => ({}))

    @connect(state => state)
    class ConnectContainer extends Component {
      render() {
        return (
          <Passthrough {...this.props} pass={this.props.bar} />
        )
      }
    }

    class Container extends Component {
      constructor() {
        super()
        this.bar = 'baz'
      }

      componentDidMount() {
        this.bar = 'foo'
        this.forceUpdate()
        this.c.forceUpdate()
      }

      render() {
        return (
          <ProviderMock store={store}>
            <ConnectContainer bar={this.bar} ref={c => this.c = c} />
          </ProviderMock>
        )
      }
    }

    const testRenderer = TestRenderer.create(<Container />)
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.bar).toEqual('foo')
  })

  it('should remove undefined props', () => {
    const store = createStore(() => ({}))
    let props = { x: true }
    let container

    @connect(() => ({}), () => ({}))
    class ConnectContainer extends Component {
      render() {
        return (
          <Passthrough {...this.props} />
        )
      }
    }

    class HolderContainer extends Component {
      render() {
        return (
          <ConnectContainer {...props} />
        )
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <HolderContainer ref={instance => container = instance} />
      </ProviderMock>
    )

    const propsBefore = {
      ...testRenderer.root.findByType(Passthrough).props
    }

    props = {}
    container.forceUpdate()

    const propsAfter = {
      ...testRenderer.root.findByType(Passthrough).props
    }

    expect(propsBefore.x).toEqual(true)
    expect('x' in propsAfter).toEqual(false, 'x prop must be removed')
  })

  it('should remove undefined props without mapDispatch', () => {
    const store = createStore(() => ({}))
    let props = { x: true }
    let container

    @connect(() => ({}))
    class ConnectContainer extends Component {
      render() {
        return (
          <Passthrough {...this.props} />
        )
      }
    }

    class HolderContainer extends Component {
      render() {
        return (
          <ConnectContainer {...props} />
        )
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <HolderContainer ref={instance => container = instance} />
      </ProviderMock>
    )

    const propsBefore = {
      ...testRenderer.root.findByType(Passthrough).props
    }

    props = {}
    container.forceUpdate()

    const propsAfter = {
      ...testRenderer.root.findByType(Passthrough).props
    }

    expect(propsBefore.x).toEqual(true)
    expect('x' in propsAfter).toEqual(false, 'x prop must be removed')
  })

  it('should ignore deep mutations in props', () => {
    const store = createStore(() => ({
      foo: 'bar'
    }))

    @connect(state => state)
    class ConnectContainer extends Component {
      render() {
        return (
          <Passthrough {...this.props} pass={this.props.bar.baz} />
        )
      }
    }

    class Container extends Component {
      constructor() {
        super()
        this.state = {
          bar: {
            baz: ''
          }
        }
      }

      componentDidMount() {
        // Simulate deep object mutation
        const bar = this.state.bar
        bar.baz = 'through'
        this.setState({
          bar
        })
      }

      render() {
        return (
          <ProviderMock store={store}>
            <ConnectContainer bar={this.state.bar} />
          </ProviderMock>
        )
      }
    }

    const testRenderer = TestRenderer.create(<Container />)
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.foo).toEqual('bar')
    expect(stub.props.pass).toEqual('')
  })

  it('should allow for merge to incorporate state and prop changes', () => {
    const store = createStore(stringBuilder)

    function doSomething(thing) {
      return {
        type: 'APPEND',
        body: thing
      }
    }

    @connect(
      state => ({ stateThing: state }),
      dispatch => ({
        doSomething: (whatever) => dispatch(doSomething(whatever))
      }),
      (stateProps, actionProps, parentProps) => ({
        ...stateProps,
        ...actionProps,
        mergedDoSomething(thing) {
          const seed = stateProps.stateThing === '' ? 'HELLO ' : ''
          actionProps.doSomething(seed + thing + parentProps.extra)
        }
      })
    )
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    class OuterContainer extends Component {
      constructor() {
        super()
        this.state = { extra: 'z' }
      }

      render() {
        return (
          <ProviderMock store={store}>
            <Container extra={this.state.extra} />
          </ProviderMock>
        )
      }
    }

    const testRenderer = TestRenderer.create(<OuterContainer />)
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.stateThing).toBe('')
    stub.props.mergedDoSomething('a')
    expect(stub.props.stateThing).toBe('HELLO az')
    stub.props.mergedDoSomething('b')
    expect(stub.props.stateThing).toBe('HELLO azbz')
    testRenderer.root.instance.setState({ extra: 'Z' })
    stub.props.mergedDoSomething('c')
    expect(stub.props.stateThing).toBe('HELLO azbzcZ')
  })

  it('should merge actionProps into WrappedComponent', () => {
    const store = createStore(() => ({
      foo: 'bar'
    }))

    @connect(
      state => state,
      dispatch => ({ dispatch })
    )
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
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.dispatch).toEqual(store.dispatch)
    expect(stub.props.foo).toEqual('bar')
    expect(() =>
      testRenderer.root.findByType(Container)
    ).not.toThrow()
    const decorated = testRenderer.root.findByType(Container)
    expect(decorated.instance.isSubscribed()).toBe(true)

  })

  it('should not invoke mapState when props change if it only has one argument', () => {
    const store = createStore(stringBuilder)

    let invocationCount = 0

    /*eslint-disable no-unused-vars */
    @connect((arg1) => {
      invocationCount++
      return {}
      })
    /*eslint-enable no-unused-vars */
    class WithoutProps extends Component {
      render() {
        return <Passthrough {...this.props} />
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

    expect(invocationCount).toEqual(1)
  })
})