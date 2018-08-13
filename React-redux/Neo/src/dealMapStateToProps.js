
function dealMapStateToProps(mapStateToProps) {
  if (!mapStateToProps) {
    return function () {
      return () =>({});
    }
  }
  if (typeof mapStateToProps === 'function') {
    return function () {
      if (mapStateToProps.length !== 1) { // // 根据参数数量判断是否依赖于connect组件的props值
        mapStateToProps.dependsOnOwnProps = true;
        return mapStateToProps;
      }
      return mapStateToProps
    }
  }
}

export default dealMapStateToProps;