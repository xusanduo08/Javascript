import isPlainObject from './isPlainObject';

function dealMapStateToProps(mapStateToProps) {
  if (!mapStateToProps) {
    return function () {
      return () =>({});
    }
  }
  if (typeof mapStateToProps === 'function') {
    return function () {
      if (mapStateToProps.length !== 1) {   // 根据参数数量判断是否依赖于connect组件的props值
        mapStateToProps.dependsOnOwnProps = true;
      }
      const proxy = function mapToPropsProxy(state, ownProps){  // 返回一个函数代理，代理中对计算结果进行校验是否为原生对象
        return proxy.dependsOnOwnProps ?      //优化点
          proxy.mapToProps(state, ownProps) : proxy.mapToProps(state)
      }

      //初次运行默认设置dependsOnOwnProps为true，剩余次的运行就根据实际情况来
      proxy.dependsOnOwnProps = true;

      proxy.mapToProps = function detectFactoryAndVerfiy(state, ownProps){
        proxy.mapToProps = mapStateToProps;
        proxy.dependsOnOwnProps = mapStateToProps.dependsOnOwnProps;
        let props = proxy(state, ownProps);
        
        if(typeof props === 'function'){ // 支持mapStateToProps返回一个函数
          proxy.mapToProps = props;
          proxy.dependsOnOwnProps = props.length !== 1 ? true : false;
          props = proxy(state, ownProps);
        }

        if(!isPlainObject(props)){
          console.error('/mapStateToProps\(\) in Connect\(Container\) must return a plain object/');
        }
        return props;
      }
      return proxy;
    }
  }
  return ()=>{
    throw new Error(`InvalidMapState:Invalid value of ${typeof mapStateToProps} for mapStateToProps arguments`); //无效的mapStateToProps，抛出错误
  }
}

export default dealMapStateToProps;