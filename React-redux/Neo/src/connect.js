import {Component, createElement} from 'react';

/*
  react-redux的主要功能就是让react的组件与redux的store关联起来，也就是订阅到store上。
  这份工作靠的主要就是connect方法。
  connect返回一个新的订阅了store的组件，
  在使用时一般这样用：
    export default connect(mapStateToProps, mapDispatchToProps)(component)

  我们先考虑只有mapStateToProps和mapDispatchToProps两个参数，有其他参数的情况我们先按住不表。
*/

function connect(mapStateToProps, mapDispatchToProps){
  //如何获取到store，从上下文中获取，由Provider将store放到上下文中

  class Connect extends Component {
    constructor(props, context){
      super(props, context);
      this.store = this.context.store;
      this.init();  // 初始化
    }

    init(){
      //从store中拿到state，并用mapStateToProsp、mapDispatchToProps计算出要传入component的props
      this.stateProps = mapStateToProps(state);
      this.dispatchProps = mapDispatchToProps(state);
      this.store.subscribe(this.onStateChange);
    }

    onStateChange(){
      //state如果发生变化，就要重新计算props值，并让组件re-render。
      this.stateProps = mapStateToProps(state);
      this.dispatchProps = mapDispatchToProps(state);
      this.setState({});  // 仅为触发组件re-render过程。
    }
  }

  return function(component){
    return createElement(component, {...this.stateProps, ...this.dispatchProps});
  }
}


export default connect;