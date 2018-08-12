
function dealMapStateToProps(mapStateToProps) {
  if (!mapStateToProps) {
    return function () {
      return {};
    }
  }
  if (typeof mapStateToProps === 'function') {
    return function (state) {
      return mapStateToProps(state);
    }
  }
}

export default dealMapStateToProps;