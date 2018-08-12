//专门用来计算属性的类

const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}


export default class Selector {
  constructor(initMapStateToProps, initMapDispatchToProps, store) {
    this.initMapDispatchToProps = initMapDispatchToProps;
    this.initMapStateToProps = initMapStateToProps;
    this.store = store;
    this.props = {};  //当前计算出的要传给组件的props值
    this.ownProps = {}; // 保存当前已经传给组件的props值
    this.ownState = {};
  }

  run(nextOwnProps) {
    if (!shallowEqual(nextOwnProps, this.ownProps)
      || !shallowEqual(this.ownState, this.store.getState())) {  //浅比较，不会处理对象的突变
      const nextProps = {
        ...nextOwnProps,
        ...this.initMapDispatchToProps(this.store.dispatch),
        ...this.initMapStateToProps(this.store.getState())
      };
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