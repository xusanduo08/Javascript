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

  it('should invoke mapDispatch every time props are changed if it has a second argument', () => {
    const store = createStore(stringBuilder)

    let propsPassedIn
    let invocationCount = 0

    @connect(null, (dispatch, props) => {
      invocationCount++
      propsPassedIn = props
      return {}
    })
    class WithProps extends Component {
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
            <WithProps {...this.state} />
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
    outerComponent.setFoo('BAZ')

    expect(invocationCount).toEqual(3)
    expect(propsPassedIn).toEqual({
      foo: 'BAZ'
    })
  })

  it('should pass dispatch and avoid subscription if arguments are falsy', () => {
    const store = createStore(() => ({
      foo: 'bar'
    }))

    function runCheck(...connectArgs) {
      @connect(...connectArgs)
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
      expect(stub.props.foo).toBe(undefined)
      expect(stub.props.pass).toEqual('through')
      expect(() =>
        testRenderer.root.findByType(Container)
      ).not.toThrow()
      const decorated = testRenderer.root.findByType(Container)
      expect(decorated.instance.isSubscribed()).toBe(false)
    }

    runCheck()
    runCheck(null, null, null)
    runCheck(false, false, false)
  })

  it('should unsubscribe before unmounting', () => {
    const store = createStore(stringBuilder)
    const subscribe = store.subscribe

    // Keep track of unsubscribe by wrapping subscribe()
    const spy = jest.fn(() => ({}))
    store.subscribe = (listener) => {
      const unsubscribe = subscribe(listener)
      return () => {
        spy()
        return unsubscribe()
      }
    }

    @connect(
      state => ({ string: state }),
      dispatch => ({ dispatch })
    )
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const div = document.createElement('div')
    ReactDOM.render(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>,
      div
    )

    expect(spy).toHaveBeenCalledTimes(0)
    ReactDOM.unmountComponentAtNode(div)
    expect(spy).toHaveBeenCalledTimes(1)
  })
  
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

  it('should not attempt to set state after unmounting nested components', () => {
    const store = createStore(() => ({}))
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


    let A = () => (<h1>A</h1>)
    A = connect(() => ({ calls: ++mapStateToPropsCalls }))(A)


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
        return (<App setLocation={this.setLocation}>
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

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    linkA.click()
    linkB.click()
    linkB.click()

    spy.mockRestore()
    document.body.removeChild(div)
    expect(mapStateToPropsCalls).toBe(3)
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('should not attempt to set state when dispatching in componentWillUnmount', () => {
    const store = createStore(stringBuilder)
    let mapStateToPropsCalls = 0

    /*eslint-disable no-unused-vars */
    @connect(
      (state) => ({ calls: mapStateToPropsCalls++ }),
      dispatch => ({ dispatch })
    )
    /*eslint-enable no-unused-vars */
    class Container extends Component {
      componentWillUnmount() {
        this.props.dispatch({ type: 'APPEND', body: 'a' })
      }
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const div = document.createElement('div')
    ReactDOM.render(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>,
      div
    )
    expect(mapStateToPropsCalls).toBe(1)

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ReactDOM.unmountComponentAtNode(div)
    spy.mockRestore()
    expect(spy).toHaveBeenCalledTimes(0)
    expect(mapStateToPropsCalls).toBe(1)
  })

  it('should shallowly compare the selected state to prevent unnecessary updates', () => {
    const store = createStore(stringBuilder)
    const spy = jest.fn(() => ({}))
    function render({ string }) {
      spy()
      return <Passthrough string={string}/>
    }

    @connect(
      state => ({ string: state }),
      dispatch => ({ dispatch })
    )
    class Container extends Component {
      render() {
        return render(this.props)
      }
    }

    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <Container />
      </ProviderMock>
    )

    const stub = testRenderer.root.findByType(Passthrough)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(stub.props.string).toBe('')
    store.dispatch({ type: 'APPEND', body: 'a' })
    expect(spy).toHaveBeenCalledTimes(2)
    store.dispatch({ type: 'APPEND', body: 'b' })
    expect(spy).toHaveBeenCalledTimes(3)
    store.dispatch({ type: 'APPEND', body: '' })
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('should shallowly compare the merged state to prevent unnecessary updates', () => {
    const store = createStore(stringBuilder)
    const spy = jest.fn(() => ({}))
    function render({ string, pass }) {
      spy()
      return <Passthrough string={string} pass={pass} passVal={pass.val} />
    }

    @connect(
      state => ({ string: state }),
      dispatch => ({ dispatch }),
      (stateProps, dispatchProps, parentProps) => ({
        ...dispatchProps,
        ...stateProps,
        ...parentProps
      })
    )
    class Container extends Component {
      render() {
        return render(this.props)
      }
    }

    class Root extends Component {
      constructor(props) {
        super(props)
        this.state = { pass: '' }
      }

      render() {
        return (
          <ProviderMock store={store}>
            <Container pass={this.state.pass} />
          </ProviderMock>
        )
      }
    }

    const testRenderer = TestRenderer.create(<Root />)
    const tree = testRenderer.root.instance
    const stub = testRenderer.root.findByType(Passthrough)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(stub.props.string).toBe('')
    expect(stub.props.pass).toBe('')

    store.dispatch({ type: 'APPEND', body: 'a' })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe('')

    tree.setState({ pass: '' })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe('')

    tree.setState({ pass: 'through' })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe('through')

    tree.setState({ pass: 'through' })
    expect(spy).toHaveBeenCalledTimes(3)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe('through')

    const obj = { prop: 'val' }
    tree.setState({ pass: obj })
    expect(spy).toHaveBeenCalledTimes(4)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe(obj)

    tree.setState({ pass: obj })
    expect(spy).toHaveBeenCalledTimes(4)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe(obj)

    const obj2 = Object.assign({}, obj, { val: 'otherval' })
    tree.setState({ pass: obj2 })
    expect(spy).toHaveBeenCalledTimes(5)
    expect(stub.props.string).toBe('a')
    expect(stub.props.pass).toBe(obj2)

    obj2.val = 'mutation'
    tree.setState({ pass: obj2 })
    expect(spy).toHaveBeenCalledTimes(5)
    expect(stub.props.string).toBe('a')
    expect(stub.props.passVal).toBe('otherval')
  })

  it('should throw an error if a component is not passed to the function returned by connect', () => {
    expect(connect()).toThrow(
      /You must pass a component to the function/
    )
  })

  it('should throw an error if mapState, mapDispatch, or mergeProps returns anything but a plain object', () => {
    const store = createStore(() => ({}))

    function makeContainer(mapState, mapDispatch, mergeProps) {
      return React.createElement(
        @connect(mapState, mapDispatch, mergeProps)
        class Container extends Component {
          render() {
            return <Passthrough />
          }
        }
      )
    }

    function AwesomeMap() { }

    let spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => 1, () => ({}), () => ({}))}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mapStateToProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => 'hey', () => ({}), () => ({}))}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mapStateToProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => new AwesomeMap(), () => ({}), () => ({}))}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mapStateToProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => ({}), () => 1, () => ({}))}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mapDispatchToProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => ({}), () => 'hey', () => ({}))}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mapDispatchToProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => ({}), () => new AwesomeMap(), () => ({}))}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mapDispatchToProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => ({}), () => ({}), () => 1)}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mergeProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => ({}), () => ({}), () => 'hey')}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mergeProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()

    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    TestRenderer.create(
      <ProviderMock store={store}>
        {makeContainer(() => ({}), () => ({}), () => new AwesomeMap())}
      </ProviderMock>
    )
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toMatch(
      /mergeProps\(\) in Connect\(Container\) must return a plain object/
    )
    spy.mockRestore()
  })

  it('should recalculate the state and rebind the actions on hot update', () => {
    const store = createStore(() => {})

    @connect(
      null,
      () => ({ scooby: 'doo' })
    )
    class ContainerBefore extends Component {
      render() {
        return (
          <Passthrough {...this.props} />
        )
      }
    }

    @connect(
      () => ({ foo: 'baz' }),
      () => ({ scooby: 'foo' })
    )
    class ContainerAfter extends Component {
      render() {
        return (
          <Passthrough {...this.props} />
        )
      }
    }

    @connect(
      () => ({ foo: 'bar' }),
      () => ({ scooby: 'boo' })
    )
    class ContainerNext extends Component {
      render() {
        return (
          <Passthrough {...this.props} />
        )
      }
    }

    let container
    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <ContainerBefore ref={instance => container = instance} />
      </ProviderMock>
    )
    const stub = testRenderer.root.findByType(Passthrough)
    expect(stub.props.foo).toEqual(undefined)
    expect(stub.props.scooby).toEqual('doo')

    imitateHotReloading(ContainerBefore, ContainerAfter, container)
    expect(stub.props.foo).toEqual('baz')
    expect(stub.props.scooby).toEqual('foo')

    imitateHotReloading(ContainerBefore, ContainerNext, container)
    expect(stub.props.foo).toEqual('bar')
    expect(stub.props.scooby).toEqual('boo')
  })

  it('should persist listeners through hot update', () => {
    const ACTION_TYPE = "ACTION"
    const store = createStore((state = {actions: 0}, action) => {
      switch (action.type) {
        case ACTION_TYPE: {
          return {
            actions: state.actions + 1
          }
        }
        default:
          return state
      }
    })

    @connect(
      (state) => ({ actions: state.actions })
    )
    class Child extends Component {
      render() {
        return <Passthrough {...this.props}/>
      }
    }

    @connect(
      () => ({ scooby: 'doo' })
    )
    class ParentBefore extends Component {
      render() {
        return (
          <Child />
        )
      }
    }

    @connect(
      () => ({ scooby: 'boo' })
    )
    class ParentAfter extends Component {
      render() {
        return (
          <Child />
        )
      }
    }

    let container
    const testRenderer = TestRenderer.create(
      <ProviderMock store={store}>
        <ParentBefore ref={instance => container = instance}/>
      </ProviderMock>
    )

    const stub = testRenderer.root.findByType(Passthrough)

    imitateHotReloading(ParentBefore, ParentAfter, container)

    store.dispatch({type: ACTION_TYPE})

    expect(stub.props.actions).toEqual(1)
  })

  it('should set the displayName correctly', () => {
    expect(connect(state => state)(
      class Foo extends Component {
        render() {
          return <div />
        }
      }
    ).displayName).toBe('Connect(Foo)')

    expect(connect(state => state)(
      createClass({
        displayName: 'Bar',
        render() {
          return <div />
        }
      })
    ).displayName).toBe('Connect(Bar)')

    expect(connect(state => state)(
      // eslint: In this case, we don't want to specify a displayName because we're testing what
      // happens when one isn't defined.
      /* eslint-disable react/display-name */
      createClass({
        render() {
          return <div />
        }
      })
      /* eslint-enable react/display-name */
    ).displayName).toBe('Connect(Component)')
  })

  it('should expose the wrapped component as WrappedComponent', () => {
    class Container extends Component {
      render() {
        return <Passthrough />
      }
    }

    const decorator = connect(state => state)
    const decorated = decorator(Container)

    expect(decorated.WrappedComponent).toBe(Container)
  })
})