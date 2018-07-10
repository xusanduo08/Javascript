### `componentWillUpdate`

[原文链接](https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/tapping_into_componentwillupdate.html)

​	一旦确定组件需要更新（`shouldComponentWillUpdate`返回true），`componentWillUpdate`就会被调用。这个方法接收两个参数：`nextProps`和`nextState`。在使用上，`componentWillUpdate`和`componentWillMount`有些类似，两者部分区别在于`componentWillUpdate`每次re-render都会被调用，而且在`componentWillUpdate`中我们能获取到的是更新后的`props`和`state`。

​	`componentWillUpdate`在`render`之前调用，这点和`componentWillMount`一样。因为调用这个方法时组件还没有更新，所以如果这个时候去获取Native UI获取到的是更新前的UI。在这个方法里可以使用`refs`获取页面上的元素的实例（这点和`componentWillMount`不同），但不推荐这么做，因为接下来就要进行更新操作了，现在获取到的`refs`马上就会过期。如果有动画的话，可以在这个方法里面开始动画。

​	可以在`componentWillUpdate`方法里为下一次的更新做准备。如果想获取到老的props或者state，可以通过`this.props`和`this.state`获取，有了新旧的props和state，我们就可以根据需要做一些计算或者改变。

​	有一点要注意，在`componentWillUpdate`内部不能调用`this.setState`方法（这点和`componentWillMount`不一样），因为`this.setState`会引起下一次的更新过程，`componentWillUpdate`会被再次调用，然后方法里又调用了`this.setState`...，这就陷入了死循环中。所以，__不要在`componentWillUpdate`中调用`this.setState`方法__。

​	另外还有一些`componentWillUpdate`的使用场景，比如根据state的变化设置变量，dispatch事件或者开始动画等：

```javascript
// dispatching an action based on state change
componentWillUpdate(nextProps, nextState) {
  if (nextState.open == true && this.state.open == false) {
    this.props.onWillOpen();
  }
}
```

