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
*/


function connect(mapStateToProps, mapDispatchToProps) {

  const initMapDispatchToProps = dealMapDispatchToProps(mapDispatchToProps);
  const initMapStateToProps = dealMapStateToProps(mapStateToProps);
  return function (component) {

    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this.store = this.context.store; //从上下文中获取store，由Provider将store放到上下文中
        this.subscription = new Subscription(this.store, this.onStateChange.bind(this)); // 抽取订阅动作到订阅实例中，便于管理
        this.selector = new Selector(initMapStateToProps, initMapDispatchToProps, this.store)    //selector用来计算状态
        if (Boolean(mapStateToProps)) {
          this.init();  // 如果mapStateToProps没有传递的话，则connect组件不会去订阅store的变化。
        }
      }

      componentDidMount() {
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

      addExtraProps(props) {
        return {...props};  // 将传递到connect组件上的props也传给connect内部的组件
      }

      render() {
        return createElement(component, this.addExtraProps(this.selector.props));
      }

    }

    Connect.contextTypes = {
      store: PropTypes.object
    }
    return Connect;
  }
}




export default connect