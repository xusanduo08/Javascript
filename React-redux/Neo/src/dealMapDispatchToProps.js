import isPlainObject from './isPlainObject';

//处理mapDispatchToProps
function dealMapDispatchToProps(mapDispatchToProps) {

  //如果没有传入mapDispatchToProps参数，那么要确保dispatch方法作为props传入到组件中
  if (!mapDispatchToProps) {
    return function constantSelector() {
      return (dispatch) => ({ dispatch })
    }
  }

  //如果传入function
  if (typeof mapDispatchToProps === 'function') {
    return function () {
      if (mapDispatchToProps.length !== 1) {  // 根据参数数量判断是否依赖于connect组件的props值
        mapDispatchToProps.dependsOnOwnProps = true;
      }
      const proxy = function mapToPropsProxy(dispatch, ownProps) {
        return proxy.dependsOnOwnProps ?
          proxy.mapDispatchToProps(dispatch, ownProps) : proxy.mapDispatchToProps(dispatch)
      }

      //初次运行设置dependsOnOwnProps为true
      proxy.dependsOnOwnProps = true;

      proxy.mapDispatchToProps = function (dispatch, ownProps) {
        proxy.mapDispatchToProps = mapDispatchToProps;
        proxy.dependsOnOwnProps = mapDispatchToProps.dependsOnOwnProps;
        let dispatchProps = proxy(dispatch, ownProps);
        
        if (typeof dispatchProps === 'function') { // 支持mapStateToProps返回一个函数
          proxy.mapDispatchToProps = dispatchProps;
          proxy.dependsOnOwnProps = dispatchProps.length !== 1 ? true : false;
          dispatchProps = proxy(dispatch, ownProps);
        }

        if (!isPlainObject(dispatchProps)) {
          console.error('/mapDispatchToProps\(\) in Connect\(Container\) must return a plain object/');
        }
        return dispatchProps;
      }
      return proxy;
    }
  }

  return ()=>{
    throw new Error(`InvalidMapDispatch:Invalid value of ${typeof mapDispatchToProps} for mapDispatchToProps arguments`); //无效的mapStateToProps，抛出错误
  }
}

export default dealMapDispatchToProps;

