
//处理mapDispatchToProps
function dealMapDispatchToProps(mapDispatchToProps, dispatch) {

  //如果没有传入mapDispatchToProps参数，那么要确保dispatch方法作为props传入到组件中
  if (!mapDispatchToProps) {
    return function constantSelector(dispatch, options) {
      return { dispatch }
    }
  }

  //如果传入function
  if (typeof mapDispatchToProps === 'function') {
    return function (dispatch) {
      return mapDispatchToProps(dispatch);
    }
  }
}

export default dealMapDispatchToProps;

