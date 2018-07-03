###子组件的传递

有这样的一个场景，当前的组件需要在特定的上下文中渲染，或者我们需要把当前组件包裹起来以给其一些特定的数据。例如，我们有时候会创建一个上下文，然后在上下文中渲染传进来的子组件，像下面这样：

```react
class SomeContextProvider extends React.component{
  getChildContext(){
    return {some: "context"}
  }
  
  render(){
    //如何返回children？
  }
}
```

这里有一个问题，如何在`render()`中返回传进来的children。有两种看起来可以的方法：

* 将children包裹在一个`<div />`中
* 直接`return children`

两种方法中，第一种，可以达到目的，但是因为加入了额外的块级元素`div`，所以有可能会影响到页面布局和样式。

第二种方法会返回一些错误。（_这地方我亲自试了下，发现控制台并没有提示什么错误，页面也能正常渲染,不知道是不是react更新了还是啥_）

```react
// option 1: extra div
return <div>{children}</div>

// option 2: unhelpful errors
return children
```

其实最恰当的是使用React提供的`React.Children`方法来处理`children`：

```react
return React.Children.only(this.props.children);
```

