import shallowEqual from './shallowEqual';
import isPlainObject from './isPlainObject';

// connect 方法的第三个参数，用来自定义合并属性，也可以传入自己想加入属性
function dealMergeProps(mergeProps) {
  let mergedProps;
  if(!mergeProps){
    return function (stateProps, dispatchProps, ownProps){
      return { ...ownProps, ...stateProps, ...dispatchProps }
    }
  } 
  if(typeof mergeProps == 'function') {
    let hasRunOnce = false; // 是否已运行过一次 false 没有 true 有
    return function(stateProps, dispatchProps, ownProps){
      const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps)
      if(hasRunOnce){
        if(!shallowEqual(mergedProps, nextMergedProps)){
          mergedProps = nextMergedProps;
        }
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;
        if(!isPlainObject(mergedProps)){  //对结果进行校验，是否是原生对象，只第一次运行时进行校验和提示
          console.error('/mergeProps\(\) in Connect\(Container\) must return a plain object/');
        }
      }
      
      return mergedProps;
    }
  }
  return ()=>{
    throw new Error(`InvalidMerge:Invalid value of ${typeof mergeProps} for mergeProps arguments`); //无效的mapStateToProps，抛出错误
  }
}

export default dealMergeProps;