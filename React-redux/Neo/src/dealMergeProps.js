import shallowEqual from './shallowEqual';

// connect 方法的第三个参数，用来自定义合并属性，也可以传入自己想加入属性
function dealMergeProps(mergeProps) {
  let mergedProps;
  if(!mergeProps){
    return function (stateProps, dispatchProps, ownProps){
      return { ...ownProps, ...stateProps, ...dispatchProps }
    }
  } else {
    return function(stateProps, dispatchProps, ownProps){
      const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps)
      if(!shallowEqual(mergedProps, nextMergedProps)){
        mergedProps = nextMergedProps;
      }
      return mergedProps;
    }
  } 
}

export default dealMergeProps;