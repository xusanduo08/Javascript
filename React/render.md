### `render`

​	和生命周期中的其他方法不同，`render`方法一直存在于生命周期中。组件的诞生会调用`render`，组件在更新的过程中也会调用`render`。

__在`render`中不能调用`setState`方法__

​	在组件诞生和组件更新两种情况中，我们都要确保`render`是个单纯的方法。意思就是，在这个方法里面我们不能调用`setState`方法、不能做查询页面元素以及其他可以引起已有的`state`发生突变的事情。如果在`render`中调用`setState`，会引起另一个`render`过程，而在这个新产生的`render`中又会改变`state`，然后又引起另一个`render`过程，如此往复，程序就会陷入无限循环。

​	如果我们在`render`中做了上面提到的事情，在开发态中，React会给予提示。比如下面这个例子：在render中调用`setState`方法。

```react
render() {
  // BAD: Do not do this!
  this.setState({ foo: 'bar' });
  return (
    <div className={ classNames('person', this.state.mode) }>
      { this.props.name } (age: { this.props.age })
    </div>
  );
}
```

控制台会打印出如下警告：

> Warning: setState(...): Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.

__在`render`中查询页面元素也是不可以的！__

如果在`render`中去查询页面元素，React同样会给出警告，看例子：

```react
render() {
  // BAD: Don't do this either!
  let node = ReactDOM.findDOMNode(this);
  return (
    <div className={ classNames('person', this.state.mode) }>
      { this.props.name } (age: { this.props.age })
    </div>
  );
}
```

> Warning: App is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.

上面这个例子看起来似乎是安全的，因为你只查询了元素。但是，正如警告里所说的，我们有可能查询到过时的元素数据。而且，在组件诞生的那次渲染中，这样的查询有可能是致命的，有可能会提示如下错误：

> Uncaught Invariant Violation: findComponentRoot(..., .0): Unable to find element. This probably means the DOM was unexpectedly mutated (e.g., by the browser), usually due to forgetting a <tbody> when using tables, nesting tags like <form>, <p>, or <a>, or using non-SVG elements in an <svg> parent. Try inspecting the child nodes of the element with React ID `Person`.

上面的报错信息并没有明确的指出错误的原因。在我们的例子中我们并没有修改DOM，所以看起来这个报错信息是不正确的。这种类型的错误在初期会给开发者一些痛苦。

之所以会提示上面的错误，是因为在第一次渲染时我们所想查找的元素并不存在。我们想让React去找一个DOM，当React以这个元素存在为前提（因为开发者让它去找，所以它会以为这个元素是存在）去找但是却找不到时，它就认为这个元素被修改了，所以就会提示上面的错误。



