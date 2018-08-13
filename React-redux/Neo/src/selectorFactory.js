//专门用来计算属性的类

import shallowEqual from './shallowEqual'

export default class Selector {
  constructor(initMapStateToProps, initMapDispatchToProps, initMergeProps, store) {
    this.mapDispatchToProps = initMapDispatchToProps();
    this.mapStateToProps = initMapStateToProps();
    this.initMergeProps = initMergeProps;
    this.store = store;
    this.props = {};  //当前计算出的要传给组件的props值
    this.ownProps = {}; // 保存当前已经传给组件的props值
    this.ownState = {}; // 当前组件的state值
    this.stateProps = {}; //根据state计算出来的要传入组件的props值
    this.dispatchProps = {};
  }

  handleNewProps(nextOwnProps){
    this.ownProps = nextOwnProps;
    if(this.mapStateToProps.dependsOnOwnProps){
      this.stateProps = this.mapStateToProps(this.ownState, nextOwnProps);
    }
    if(this.mapDispatchToProps.dependsOnOwnProps){
      this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, nextOwnProps);
    }
    return this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps)
  }

  handleNewState(newState){
    this.ownState = newState;
    this.stateProps = this.mapStateToProps(newState, this.ownProps);
    this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, this.ownProps); // 这里dispatchProps其实不用每次都计算，毕竟它的值不会因为state有变化而变化
    return this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps)
  }

  handleNewPropsAndNewState(nextOwnProps, nextState){
    this.stateProps = this.mapStateToProps(nextState, nextOwnProps);
    this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, nextOwnProps) // 此处可优化
    return this.initMergeProps(this.stateProps, this.dispatchProps, nextOwnProps)
  }

  run(nextOwnProps) {
    if (!shallowEqual(nextOwnProps, this.ownProps)
      || !shallowEqual(this.ownState, this.store.getState())) {  //浅比较，不会处理对象的突变
      const propsChanged = !shallowEqual(nextOwnProps, this.ownProps);
      const stateChanged =  !shallowEqual(this.ownState, this.store.getState());

      this.shouldUpdate = true;
      if(propsChanged && stateChanged){  
        this.ownProps = nextOwnProps;
        this.ownState = this.store.getState();
        this.props = this.handleNewPropsAndNewState(nextOwnProps, this.store.getState())
        return this.props;
      }
      if(propsChanged){
        this.props = this.handleNewProps(nextOwnProps);
        return this.props;
      }
      if(stateChanged){
        this.props = this.handleNewState(this.store.getState());
        return this.props;
      }     
    } else {
      this.shouldUpdate = false;
      return this.props;
    }
    
  }
}