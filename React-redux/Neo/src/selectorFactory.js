//专门用来计算属性的类

export default class Selector {
    constructor(initMapStateToProps, initMapDispatchToProps, store){
        this.initMapDispatchToProps = initMapDispatchToProps;
        this.initMapStateToProps = initMapStateToProps;
        this.store = store;
        this.props = {};
    }

    run(store){
        this.props =  {...this.initMapDispatchToProps(this.store.dispatch), ...this.initMapStateToProps(this.store.getState())};
        return this.props;
    }
}