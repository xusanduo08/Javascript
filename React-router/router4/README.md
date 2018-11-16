`<Route path='' component={XX} />`

如果component是一个函数,那么每次渲染都会创建一个实例，这会使得在更新的时候，组件被卸载然后又挂载，而不是仅仅__更新__
如果使用一个函数表示component，那么最好使用`render`或者`children`属性。