### Post-Render with `componentDidUpdate`

​	组件re-render之后，就来到了`componentDidUpdate`方法中，这个方法相当于`componentDidMount`组件更新阶段的翻版。所以，和`componentDidMount`一样，我们在这个方法里，可以获取到Native UI，可以调用`refs`，或者根据要求开始另一次re-render过程。

​	`componentDidUpdate`接收 两个参数：`prevProps`和`prevState`。这点`componentWillUpdate`正好相反。传入的参数是更新以前的值，`this.props`和`this.state`是更新后也就是现在的值。

![re-render](./img/201807111924.png)

​	和`componentDidMount`一样，`componentDidUpdate`的调用也是先子组件然后当前组件。上面这个结构，按照调用顺序，先A.0.0调用，然后A.0，最后A。

#### 常见用处

​	常见的一个用处就是在方法内处理3D显示效果或者获取Native UI，进行其它相关操作。当使用3D库时，比如图标类库，我们需要在这里把新数据更新到UI上来。

```javascript
componentDidUpdate(prevProps, prevState) {
  // only update chart if the data has changed
  if (prevProps.data !== this.props.data) {
    this.chart = c3.load({
      data: this.props.data
    });
  }
}
```

​	在这里我们拿到了图表实例，并将变更后的数据更新到了上面。

#### 再一次更新？

​	在这个方法里我们可以获取到Native UI、页面尺寸、元素样式等等。有了这些数据我们可以更新组件内部的state或者重新计算传给子组件的props。在这种情况下我们可以调用`this.setState`或者`forceUpdate`方法，但是这又会引起一次新的更新过程从而有可能产生一些潜在的问题。

​	最糟糕的例如下面一种情况，无条件的直接调用了`setState`方法：

```javascript
componentDidUpdate(prevProps, prevState) {
  // BAD: DO NOT DO THIS!!!
  let height = ReactDOM.findDOMNode(this).offsetHeight;
  this.setState({ internalHeight: height });
}
```

​	因为`shouldComponentUpdate`默认返回true，所以上面的代码会让我们陷入一种无限循环渲染的过程。

​	如果我们真的要做类似上面这事情，我们可以在调用`componentDidUpdate`时添加一个判断或者在内部判断是否真的需要更新：

```javascript
componentDidUpdate(prevProps, prevState) {
  // One possible fix...
  let height = ReactDOM.findDOMNode(this).offsetHeight;
  if (this.state.height !== height ) {
    this.setState({ internalHeight: height });
  }
}
```

​	总的来说，这样的需求并不常见。要记住，二次re-render对你的组件和应用有一定的影响（副作用）。