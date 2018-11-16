[原文链接](https://reactjs.org/blog/2016/01/08/A-implies-B-does-not-imply-B-implies-A.html)

这篇文章主要讲的就是为什么需`componentWillReceiveProps`。

组件接收到`props`时以及`props`发生改变时，`componentWillReceiveProps`方法会被调用（A=>B），但是当`componentWillReceiveProps`被调用时`props`一定就发生改变了么，其实不是，(A=>B) != (B=>A)。

```react
class Component extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps.data.bar);
  }
  render() {
    return <div>Bar {this.props.data.bar}!</div>;
  }
}

var container = document.getElementById('container');

var mydata = {bar: 'drinks'};
ReactDOM.render(<Component data={mydata} />, container);//渲染
ReactDOM.render(<Component data={mydata} />, container);//更新
ReactDOM.render(<Component data={mydata} />, container);//更新
```

上面的代码运行后，控制台会打印几次数据？答案：2次。两次更新操作各打印一次，而且事实上，这两次传入的`props`并没有改变。



在初次渲染和两次更新之间，`mydata`是有可能发生改变的，如果像下面这样数据发生突变：

```react
var mydata = {bar: 'drinks'};
ReactDOM.render(<Component data={mydata} />, container);
mydata.bar = 'food'
ReactDOM.render(<Component data={mydata} />, container);
mydata.bar = 'noise'
ReactDOM.render(<Component data={mydata} />, container);
```

对于React来讲，它不知道数据有没有发生改变。而组件需要知道新的`props`（即使`props`的值实际没有改变），所以这个时候React需要调用`componentWillReceiveProps`方法。

因为`mydata`作为数据有多种可能，纯对象、函数、或者是指向一个闭包内部变量的引用，又或者是一个指向在父类render期间无法实例化的对象，基于这些原因，React没法轻易的判断出`props`是否发生了改变为了能比较前后`props`的变更以及能基于`props`情况做一些指定的动作，React会调用`componentWillReceiveProps`。

在`componentWillReceiveProps`内部，我们可以获取到新的props，更新组件内部的state。如果我们有一个`state`是基于`props`的计算结果，那么我们把计算逻辑以及`this.setState()`放在这个函数内部调用是安全的，__在这个函数内部调用`this.setState()`不会另外触发render动作__。

在组件挂载时，`componentWillReceiveProps`不会被调用。只有当组件的props可能更新时会被调用。此外，`this.setState()`不会引起`componentWillReceiveProps`的执行。换句话说，因为`state`改变而触发的update是会跳过`componentWillReceiveProps`的。