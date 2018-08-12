//专门用来计算属性的类

import shallowEqual from './shallowEqual'

export default class Selector {
  constructor(initMapStateToProps, initMapDispatchToProps, initMergeProps, store) {
    this.initMapDispatchToProps = initMapDispatchToProps;
    this.initMapStateToProps = initMapStateToProps;
    this.initMergeProps = initMergeProps;
    this.store = store;
    this.props = {};  //当前计算出的要传给组件的props值
    this.ownProps = {}; // 保存当前已经传给组件的props值
    this.ownState = {};
  }

  run(nextOwnProps) {
    if (!shallowEqual(nextOwnProps, this.ownProps)
      || !shallowEqual(this.ownState, this.store.getState())) {  //浅比较，不会处理对象的突变
      const nextProps =this.initMergeProps(
        this.initMapStateToProps(this.store.getState()),
        this.initMapDispatchToProps(this.store.dispatch),
        nextOwnProps
      )
        
      this.shouldUpdate = true;
      this.props = nextProps;
      this.ownProps = nextOwnProps;
      this.ownState = this.store.getState();
    } else {
      this.shouldUpdate = false;
    }
    return this.props;
  }
}