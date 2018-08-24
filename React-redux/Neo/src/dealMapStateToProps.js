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

      proxy.mapToProps = function detectFactoryAndVerfiy(state, ownProps){
        proxy.mapToProps = mapStateToProps;
        proxy.dependsOnOwnProps = mapStateToProps.dependsOnOwnProps;
        let props = proxy(state, ownProps);
        
        if(!isPlainObject(props)){
          console.error('/mapStateToProps\(\) in Connect\(Container\) must return a plain object/');
        }
        return props;
      }
      return proxy;
    }
  }
}

export default dealMapStateToProps;