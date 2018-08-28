//专门用来计算属性的类

import shallowEqual from './shallowEqual'

//react-readux中对state进行比较时直接用的严格等于‘===’，而对于props的比较则是采用浅比较，我不知道这是为什
//讲道理，state每次计算是都是从store重新取值的，肯定不会严格等于已经存储的state值，也就是说，只要有dispatch操作，就一定会重新渲染
function areStatesEqual(a, b) {
  return a === b
}

export default class Selector {
  constructor(initMapStateToProps, initMapDispatchToProps, initMergeProps, store, { pure = true }) {
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
    this.pure = pure; // pure为true，将对根据state计算出来的props进行浅比较，避免不必要的更新，
    this.error = null;
  }

  handleNewProps(nextOwnProps) {
    this.ownProps = nextOwnProps;
    if (this.mapStateToProps.dependsOnOwnProps) {
      this.stateProps = this.mapStateToProps(this.ownState, nextOwnProps);
    }
    if (this.mapDispatchToProps.dependsOnOwnProps) {
      this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, nextOwnProps);
    }
    return this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps)
  }

  handleNewState(newState) {
    this.ownState = newState;
    const nextStateProps = this.mapStateToProps(newState, this.ownProps);
    const statePropsChanged = !shallowEqual(nextStateProps, this.stateProps);//这地方比较props变化，用的又是浅比较了

    // 这里dispatchProps其实不用每次都计算，毕竟它的值不会因为state有变化而变化
    // 但是又主要将mapToDispatch运行并将结果传入组件中，此后除非connect的props发生改变了，其他情况不需要再运行mapToDispatch
    // 也就是说，在组件初次渲染时，connect的init方法中的那次selector.run中，mapToDispatch需要运行一次，此后props或state有变化是否要运行视情况而定。
    //this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, this.ownProps);
    if (statePropsChanged) {
      this.stateProps = nextStateProps
      return this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps)  //这地方要注意，是不是state改变了计算出来的props就一定发生改变呢？
      //这个不一定，计算规则是根据reducer来的，所以state改变，相应的props不一定改变。
    }

    return this.props;
  }

  handleNewPropsAndNewState(nextOwnProps, nextState) {
    this.ownProps = nextOwnProps;
    this.ownState = this.store.getState();
    this.stateProps = this.mapStateToProps(nextState, nextOwnProps);
    if (this.dispatchProps.dependsOnOwnProps) { //优化点：如果mapToDispatch是依赖于ownProps的，才进行计算。
      this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, nextOwnProps);
    }
    return this.initMergeProps(this.stateProps, this.dispatchProps, nextOwnProps)
  }

  handleChanges(nextOwnProps) {
    if (!shallowEqual(nextOwnProps, this.ownProps)
      || !areStatesEqual(this.ownState, this.store.getState())) {  //浅比较，不会处理对象的突变
      const propsChanged = !shallowEqual(nextOwnProps, this.ownProps);
      const stateChanged = !areStatesEqual(this.ownState, this.store.getState());
      this.shouldUpdate = true;
      if (propsChanged && stateChanged) {
        this.props = this.handleNewPropsAndNewState(nextOwnProps, this.store.getState())
        return;
      }
      if (propsChanged) {
        let nextProps = this.handleNewProps(nextOwnProps);
        if (!shallowEqual(this.props, nextProps)) { // 加入浅比较，避免不必要的更新。
          this.props = nextProps;
        } else {
          this.shouldUpdate = false;
        }
        return;
      }

      //有state改变，并不一定代表计算出来的要传入包裹组件的props也会有变更，那ownProsp改变了，是不是也是同样的处理呢？
      //我看到react-redux中并没有对ownProps的改变做类似的处理。我理解，ownProps是需要传递给被包裹组件的，如果ownProps发生改变了，那么被包裹组件接收的props一定发生了改变
      //所以，此时的被包裹组件肯定要重新渲染。而对于state，因为需要根据reducer计算出stateProps传给被包裹组件，如果stateProps没有改变而且ownProps也没有改变时
      //被包裹组件是不需要重新渲染的------就是这个逻辑,ownPros发生改变一定要更新，state发生改变不一定要更新
      if (stateChanged) {
        const nextStateProps = this.handleNewState(this.store.getState());
        if (this.props !== nextStateProps) {
          this.props = nextStateProps;
          this.shouldUpdate = true;
        } else {
          this.shouldUpdate = false;
        }
        return;
      }
    } else {
      this.shouldUpdate = false;
    }
  }

  // 专门用来进行第一次属性值的计算
  handleFirstCall(nextOwnProps) {
    this.ownProps = nextOwnProps;
    this.ownState = this.store.getState();
    this.stateProps = this.mapStateToProps(this.ownState, this.ownProps);
    this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, this.ownProps);
    this.firstCall = false;
    this.shouldUpdate = true;
    this.props = this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps);
  }

  pureRun(nextOwnProps) {
    if (!this.firstCall) {
      this.handleChanges(nextOwnProps);
    } else {
      this.handleFirstCall(nextOwnProps);
    }
  }

  impureRun(nextOwnProps) {
    this.ownProps = nextOwnProps;
    this.ownState = this.store.getState();
    this.stateProps = this.mapStateToProps(this.ownState, this.ownProps);
    this.dispatchProps = this.mapDispatchToProps(this.store.dispatch, this.ownProps);
    this.shouldUpdate = true;
    this.props = this.initMergeProps(this.stateProps, this.dispatchProps, this.ownProps);
  }

  run(nextOwnProps) {
    // 这地方的错误处理目前用到的场景就是父组件在componentWillUnmount中dispatch了action
    // 这个时候子组件在mapToProps计算时就会抛出错误，这地方捕捉到错误，并使程序继续运行下去。
    try{
      if (this.pure) {
        this.pureRun(nextOwnProps)
      } else {
        this.impureRun(nextOwnProps)
      }
    } catch(e){
      this.error = e;
      this.shouldUpdate = true;
    }
    
  }
}