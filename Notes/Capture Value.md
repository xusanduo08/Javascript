**Capture Value**直译过来应该是“捕获数值”。

Function component和class component一个显著但是容易被忽视的区别是：

**React中 function component可以capture value，而class component则不能**

我们使用button来模拟一个订阅操作：点击button，3秒后显示刚刚订阅的用户。

使用function component实现的话，代码如下：

```javascript
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```

同样的class component 可以用如下代码实现：

```javascript
class ProfilePage extends React.Component {
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

从表面上看，这两种方式没有什么区别，都是点击button，3秒后显示订阅的用户，而且两个组件都是从props中读取user信息。

现在有个select按钮，可以切换当前用户，页面父组件会将当前用户通过props传递给上面的两个订阅button。

假如，点击了订阅button后，切换了用户，那么3秒后显示订阅的应该仍然是刚刚点击时页面上显示的用户，但实际效果是：function component可以正确显示，class component显示订阅的却是切换后的用户：

![](../img/class-component-bug.gif)



这就是function component和class component之间区别的最直观的展示。

**为什么会这样？**

```jsx
class ProfilePage extends React.Component {
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };
}
```

以上是class component中的`showMessage`方法，从`this.props.user`读取用户信息。虽然说props不可变（immutable），但是**`this`可变（mutable）**。

因为re-render的时候`this`改变了，所以才可以从`this`中读取到最新的组件信息，页面上也才能渲染出最新的UI。

回到例子中，因为在3秒的等待中，`this`改变了，所以3秒后，`this.props.user`读取到的就已经是最新的用户信息了。

可以这么理解：UI=f(state)，同时待触发的事件方法也是当前状态的一个渲染结果（这个事件是在某次渲染中触发的，那么对应的事件回调就应该只属于本次渲染）。或者说，事件方法属于含有特定props和state的render。

但是在一段时间等待之后，由于我们的事件方法并没有绑定到特定的render，所以失去了与那个含有指定props和state的render的联系（因为这个联系是通过`this`维护的，而`this`又发生了改变）。

**如何解决？**

需要通过某种方式来修复`render`和`showMessage`之间的关系，使`showMessage`能获取到正确的props和state。

一种方法是提前读取`this.props`，并将其显式的传给定时器：

```jsx
class ProfilePage extends React.Component {
  showMessage = (user) => {
    alert('Followed ' + user);
  };

  handleClick = () => {
    const {user} = this.props;
    setTimeout(() => this.showMessage(user), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

其实还是利用了匿名函数创建闭包，使用闭包引用着正确的`user`信息。

这种方法有效，但是麻烦。如果`showMessage`内部还调用了其他使用props或者state的方法，那也会遇到同样的问题，为了解决问题也需要提前传递props或者state。这样做整个代码显得很笨重。

**使用闭包**

```jsx
class ProfilePage extends React.Component {
  render() {
    // Capture the props!
    const props = this.props;

    // Note: we are *inside render*.
    // These aren't class methods.
    const showMessage = () => {
      alert('Followed ' + props.user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Follow</button>;
  }
}
```

`showMessage`处在`render`的作用域中，一直保留着对当前`render`词法作用域的引用，其中就含有已经声明的`props`变量，这时候可以说代码捕获了对应当前render的props。这样，通过闭包，`showMessage`就能访问到正确的props。

上面这个方法有效，但如果把方法都放到`render`方法中，那使用class组件的意义几乎就不存在了，所以，不如把class这个“壳”去掉：

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```

props被当做参数传入到`ProfilePage`中，并保存在`ProfilePage`的作用域中，`showMessage`作为当前作用域内部的方法，保留着对当前作用域的引用，其中也包括props，而props是不可变得（immutable），所以`showMessage`一直能访问到正确的`props.user`。

当父组件使用不同的props渲染`ProfilePage`时，React会再次调用`ProfilePage`方法。而我们刚刚触发的事件方法属于前一次渲染，前一次渲染有自己的`user`值供`showMessage`方法读取，并且这个值保持着不变。

所以，function component和class component之间最大的区别就是：

**Function components capture the rendered values.**

**Hooks也具有capture value特性**

```javascript
function MessageThread() {
  const [message, setMessage] = useState('');

  const showMessage = () => {
    alert('You said: ' + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

上面代码中，`message`能保留属于特定render的数据，并能提供给属于这个render的事件回调使用。所以在3秒之后，页面上显示出的仍然是3秒前点击button时input框内输入的值。

**如果不想capture value，想获取到最新的props和state怎么办？**

在class component中，直接读取`this.props`或者`this.state`就可以了，因为React会改变`this`变量。

在function component中，可以通过`ref`来实现相同的功能。

```javascript
function MessageThread() {
  const [message, setMessage] = useState('');

  // Keep track of the latest value.
  const latestMessage = useRef('');
  useEffect(() => {
    latestMessage.current = message;
  });

  const showMessage = () => {
    alert('You said: ' + latestMessage.current);
  };
}
```

代码中读取`lastestMessage.current`就能获取到最新的state。



来源：https://github.com/gaearon/overreacted.io/blob/master/src/pages/how-are-function-components-different-from-classes/index.md

