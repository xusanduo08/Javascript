//专门用来计算属性的类

export default class Selector {
  constructor(initMapStateToProps, initMapDispatchToProps, store) {
    this.initMapDispatchToProps = initMapDispatchToProps;
    this.initMapStateToProps = initMapStateToProps;
    this.store = store;
    this.props = {};
  }

  run(props) {
    const nextProps = { ...this.initMapDispatchToProps(this.store.dispatch), ...this.initMapStateToProps(this.store.getState()), ...props };
    if (nextProps !== this.props) {
      this.shouldUpdate = true;
      this.props = nextProps;
    } else {
      this.shouldUpdate = false;
    }
    return this.props;
  }
}