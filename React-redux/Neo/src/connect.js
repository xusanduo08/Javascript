import { Component, createElement } from 'react';
import { PropTypes } from 'prop-types';
import dealMapDispatchToProps from './dealMapDispatchToProps.js'
import dealMapStateToProps from './dealMapStateToProps.js';
import Subscription from './Subscription';
import Selector from './selectorFactory';
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
    
*/


function connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    withRef = false, // 如果这个参数为true，那么被包裹的组件会通过getWrappedInstance()方法被暴露出来。
    renderCountProp = undefined, //如果传入这个参数，那么重复渲染次数就会以同名属性传入被包裹组件的props中
    shouldHandleStateChanges = false, //如果传入这个参数，那么state的变化将不会反应到视图上
    storeKey = 'store', // 上下文对象中store对应的key值
    ...extraOptions
  } = {}
) {

  const initMapDispatchToProps = dealMapDispatchToProps(mapDispatchToProps);
  const initMapStateToProps = dealMapStateToProps(mapStateToProps);
  return function (component) {

    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this.store = this.context[storeKey]; //从上下文中获取store，由Provider将store放到上下文中
        this.subscription = new Subscription(this.store, this.onStateChange.bind(this)); // 抽取订阅动作到订阅实例中，便于管理
        this.selector = new Selector(initMapStateToProps, initMapDispatchToProps, this.store)    //selector用来计算状态
        this.setWrappedInstance = this.setWrappedInstance.bind(this);
        this.renderCount = 0;   // 渲染次数
        if (Boolean(mapStateToProps)) {
          this.init();  // 如果mapStateToProps没有传递的话，则connect组件不会去订阅store的变化。
        }
      }

      componentWillReceiveProps(nextProps){
        this.selector.run(nextProps);
      }

      shouldComponentUpdate(){
        return this.selector.shouldUpdate;
      }

      componentDidMount() {
        if (shouldHandleStateChanges) { return }
        if (Boolean(mapStateToProps)) {
          this.subscription.trySubscribe()
        }
        this.selector.run(this.props);
      }

      init() {
        //从store中拿到state，并用mapStateToProsp、mapDispatchToProps计算出要传入component的props
        this.selector.run(this.props);
      }

      onStateChange() {
        //state如果发生变化，就要重新计算props值，并让组件re-render。
        this.selector.run(this.props);
        this.setState({});  // 仅为触发组件re-render过程。
      }

      //组件卸载时要释放掉空间
      componentWillUnmount() {
        if (this.subscription) {
          this.subscription.tryUnsubscribe();
        }
        this.store = null;
        this.selector = null;
        this.subscription = null;
      }

      getWrappedInstance() { //获取被包裹组件实例的引用
        return this.wrappedInstance;
      }

      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }

      addExtraProps(props) {  // 将传递到connect组件上的props也传给connect内部的组件
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
        return withExtras;
      }

      render() {
        return createElement(component, this.addExtraProps(this.selector.props));
      }

    }

    Connect.contextTypes = {
      [storeKey]: PropTypes.object
    }
    return Connect;
  }
}




export default connect