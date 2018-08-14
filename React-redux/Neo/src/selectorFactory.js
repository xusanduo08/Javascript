//专门用来计算属性的类

import shallowEqual from './shallowEqual'

export default class Selector {
  constructor(initMapStateToProps, initMapDispatchToProps, initMergeProps, store) {
    this.mapDispatchToProps = initMapDispatchToProps();
    this.mapStateToProps = initMapStateToProps();
    this.initMergeProps = initMergeProps;
    this.store = store;
    this.firstCall = true; // 是否是第一次计算
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
    // 这里dispatchProps其实不用每次都计算，毕竟它的值不会因为state有变化而变化
    // 但是又主要将mapToDispatch运行并将结果传入组件中，此后除非connect的props发生改变了，其他情况不需要再运行mapToDispatch
    // 也就是说，在组件初次渲染时，connect的init方法中的那次selector.run中，mapToDispatch需要运行一次，此后props或state有变化是否要运行视情况而定。
    //this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, this.ownProps);
    return this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps)
  }

  handleNewPropsAndNewState(nextOwnProps, nextState){
    this.ownProps = nextOwnProps;
    this.ownState = this.store.getState();
    this.stateProps = this.mapStateToProps(nextState, nextOwnProps);
    if(this.dispatchProps.dependsOnOwnProps){ //优化点：如果mapToDispatch是依赖于ownProps的，才进行计算。
      this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, nextOwnProps);
    }
    return this.initMergeProps(this.stateProps, this.dispatchProps, nextOwnProps)
  }

  handleChanges(nextOwnProps){
    if (!shallowEqual(nextOwnProps, this.ownProps)
      || !shallowEqual(this.ownState, this.store.getState())) {  //浅比较，不会处理对象的突变
      const propsChanged = !shallowEqual(nextOwnProps, this.ownProps);
      const stateChanged =  !shallowEqual(this.ownState, this.store.getState());

      this.shouldUpdate = true;
      if(propsChanged && stateChanged){  
        this.props = this.handleNewPropsAndNewState(nextOwnProps, this.store.getState())
      }
      if(propsChanged){
        this.props = this.handleNewProps(nextOwnProps);
      }
      if(stateChanged){
        this.props = this.handleNewState(this.store.getState());
      }     
    } else {
      this.shouldUpdate = false;
    }
  }

  // 专门用来进行第一次属性值的计算
  handleFirstCall(nextOwnProps){
    this.ownProps = nextOwnProps;
    this.ownState = this.store.getState();
    this.stateProps = this.mapStateToProps(this.ownState, this.ownProps);
    this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, this.ownProps);
    this.firstCall = false;
    this.shouldUpdate = true;
    this.props = this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps);
  }

  run(nextOwnProps) {
    if(!this.firstCall){
      this.handleChanges(nextOwnProps);
    } else {
      this.handleFirstCall(nextOwnProps);
    }
  }
}