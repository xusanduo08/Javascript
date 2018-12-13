import { Component, createElement } from 'react';
import { PropTypes } from 'prop-types';
import dealMapDispatchToProps from './dealMapDispatchToProps.js'
import dealMapStateToProps from './dealMapStateToProps.js';
import Subscription from './Subscription';
import Selector from './selectorFactory';
import dealMergeProps from './dealMergeProps';
import hoistStatics from './hoist-non-react-static';
/*
  react-redux的主要功能就是让react的组件与redux的store关联起来，也就是订阅到store上。
  这份工作靠的主要就是connect方法。
  connect返回一个新的订阅了store的组件，
  在使用时一般这样用：
    export default connect(mapStateToProps, mapDispatchToProps)(component)

  我们先考虑只有mapStateToProps和mapDispatchToProps两个参数，有其他参数的情况我们先按住不表。
  
  2018.8.7:将connect接收的props传递给内部组件
  2018.8.8：处理connect组件含有子组件的情况
  2018.8.9: 处理renderCountProp/shouldHandleStateChanges
  2018.8.10： 控制组件的shouldComponentUpdate
  2018.8.21: 对于<Connect1><Connect2></Connect2></Connect1>这种情况需要额外处理，主要是订阅store时有些变化，组件会将自己的订阅实例暴露在上下文中。
  2018.8.26: 增加对非react静态属性的处理
*/

let hotReloadingVersion = 0; // 热更新标识

function connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps, //自定义的合并属性的方法，入参为stateProps, dispatchProps, ownProps
  {
    withRef = false, // 如果这个参数为true，那么被包裹的组件会通过getWrappedInstance()方法被暴露出来。
    renderCountProp = undefined, //如果传入这个参数，那么重复渲染次数就会以同名属性传入被包裹组件的props中
    storeKey = 'store', // 上下文对象中store对应的key值
    getDisplayName = name => `Connect(${name})`,
    ...extraOptions
  } = {}
) {

  const initMapDispatchToProps = dealMapDispatchToProps(mapDispatchToProps);
  const initMapStateToProps = dealMapStateToProps(mapStateToProps);
  const initMergeProps = dealMergeProps(mergeProps);
  const version = hotReloadingVersion++; //因为闭包，每个组件在渲染时都有自己的version，而且是逐个递增的。
  const shouldHandleStateChanges = Boolean(mapStateToProps); //如果mapStateToProps没有传递的话，则connect组件不会去订阅store的变化。而且这个参数不应暴露出来让用户输入

  //每个connect组件都处在自己的闭包下，使用着上面声明的方法。
  return function (component) {

    if (!component) {
      throw Error('You must pass a component to the function');
    }

    const wrappedComponentName = component.displayName || component.name || 'Component'
    const displayName = getDisplayName(wrappedComponentName);

    const selectorFactoryOptions = {
      ...extraOptions,
      getDisplayName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      withRef,
      displayName,
      wrappedComponentName,
      component
    }

    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this.store = props[storeKey] || context[storeKey]; //从props中或者上下文中获取store，由Provider将store放到上下文中
        if (!this.store) {
          throw Error('Could not find "store"')
        }
        this.version = version;
        this.setWrappedInstance = this.setWrappedInstance.bind(this);
        this.renderCount = 0;   // 渲染次数
        this.propsMode = Boolean(props[storeKey]);//属性模式，true 组件从props中获取store，false组件从上下文中获取store
        this.initSelector();
        this.initSubscription();
      }

      getChildContext() {
        const subscription = this.propsMode ? null : this.subscription;//如果组件是从prosp获取store的，则其订阅实例对从上下文获取store的组件是透明的
        return {
          subscription: subscription || this.context.subscription //返回自身或者上层组件的订阅实例
        }
      }

      componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps);
      }

      shouldComponentUpdate() {
        return this.selector.shouldUpdate;
      }

      componentDidMount() {
        if (!shouldHandleStateChanges) { return }

        this.subscription.trySubscribe()
        this.selector.run(this.props);  // 考虑到如果组件在componentWillMount阶段调用dispatch发布action更改state，那么就需要重新计算状态和渲染
        if (this.selector.shouldUpdate) {
          this.forceUpdate();
        }
      }

      initSelector() {
        this.selector = new Selector(initMapStateToProps, initMapDispatchToProps, initMergeProps, this.store, selectorFactoryOptions)    //selector用来计算状态
        //从store中拿到state，并用mapStateToProsp、mapDispatchToProps计算出要传入component的props
        this.selector.run(this.props);
      }

      initSubscription() {
        if (!shouldHandleStateChanges) { return }
        const parentSub = (this.propsMode ? this.props : this.context)['subscription'];//根据propsMode从props或者上下文中获取订阅实例
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this)); // 抽取订阅动作到订阅实例中，便于管理
        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription); // 通知子组件的功能
      }

      onStateChange() {
        //state如果发生变化，就要重新计算props值，并让组件re-render。
        this.selector.run(this.props);
        if (!this.selector.shouldUpdate) {
          this.notifyNestedSubs();
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
          this.setState({});  // 仅为触发组件re-render过程。
        }
      }

      notifyNestedSubsOnComponentDidUpdate() {
        this.componentDidUpdate = undefined;  //置undefined，避免非store改变引起的更新通知子组件
        this.notifyNestedSubs();
      }

      //组件卸载时要释放掉空间
      componentWillUnmount() {
        if (this.subscription) {
          this.subscription.tryUnsubscribe();
        }
        this.store = null;
        // 退订之后onStateChange应该就不会被调用了,所以这地方应该可以不用管run方法啊，为什么还要置空函数呢？
        this.selector.run = function () { }; // 主要考虑到dispatch一个action的同时组件正准备卸载，此时组件的onStateChange可能已经处于触发状态，为了避免不必要的计算，需要去把selector.run置成空函数
        //但是我看代码，订阅函数的执行都是按照订阅顺序来的，如果在第二个订阅函数中卸载第一个订阅函数对应的组件，这个时候第一个组件的订阅函数应该运行完了才对啊，想不通
        /**
         * The subscriptions are snapshotted just before every `dispatch()` call.
        * If you subscribe or unsubscribe while the listeners are being invoked, this
        * will not have any effect on the `dispatch()` that is currently in progress.
        * However, the next `dispatch()` call, whether nested or not, will use a more
        * recent snapshot of the subscription list.
         * **/
        this.subscription = null;
        this.notifyNestedSubs = function () { };
        this.selector.shouldUpdate = false;
      }

      getWrappedInstance() { //获取被包裹组件实例的引用
        if (!withRef) {  // 获取被包裹组件实例需要传入withRef=true，否则报错
          throw Error('/To access the wrapped instance, you need to specify \{ withRef: true \} in the options argument of the connect\(\) call\./')
        }
        return this.wrappedInstance;
      }

      isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed()
      }

      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }

      addExtraProps(props) {  // 将传递到connect组件上的props也传给connect内部的组件,注意，根据state计算出来的属性会覆盖通过props传进来的属性
        if (!withRef) {
          return props;
        }
        const withExtras = { ...props };
        if (withRef) {   // 是否将被包裹组件的实例暴露出来
          withExtras.ref = this.setWrappedInstance;
        }
        if (renderCountProp) {  //是否将重复渲染次数传入props中
          withExtras[renderCountProp] = this.renderCount++;
        }
        if (this.propsMode && this.subscription) {
          withExtras.subscription = this.subscription;
        }
        return withExtras;
      }

      render() {
        this.selector.shouldUpdate = false;
        if (this.selector.error) {
          throw this.selector.error;
        } else {
          return createElement(component, this.addExtraProps(this.selector.props));
        }
        
      }

    }

    Connect.contextTypes = {
      [storeKey]: PropTypes.object,
      subscription: PropTypes.object
    }

    Connect.childContextTypes = {
      subscription: PropTypes.object
    }
    Connect.displayName = displayName;
    Connect.WrappedComponent = component

    // 处理组件热更新
    // 我理解的热更新： connect组件的更新称为热更新
    //这种情况就要重新生成Connect组件的selector和初始化subscription
    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {

        //想一下，为什么热更新后这地方的version会变？我们把热更新的组件叫target，新属性的来源对应的组件叫source
        //首先，热更新后，target的componentWillUpdate方法改变了，在这个方法内部，我们获取的version变量，是componentWillUpdate方法被定义时所在的作用域的变量
        //所以，热更新后，componentWillUpdate方法中拿到的version值就已经不是target所处闭包作用域中的version值了，而是source所处的闭包作用域的version值。
        if (this.version !== version) {
          this.version = version; //  通过version判断是否是热更新的。
          this.initSelector();  //重新计算生成selector
          let oldListeners = [];
          if (this.subscription) {
            oldListeners = this.subscription.listener.get(); // 获取到内部子组件的订阅函数
            this.subscription.tryUnsubscribe(); //退订当前的订阅
          }

          this.initSubscription();  // 重新初始化订阅实例
          if (shouldHandleStateChanges) {
            this.subscription.trySubscribe(); // 重新订阅store
            //将热更新前Connect组件订阅实例中内包含的其他子connect组件的订阅函数放到现在热更新后新生成的订阅实例中
            oldListeners.forEach(listener => this.subscription.listener.subscribe(listener));
          }
        }
      }
    }
    return hoistStatics(Connect, component);
  }
}

export default connect