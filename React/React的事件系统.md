#### React的事件系统

React会使用`addEventListener`在最顶层元素（比如window.document）上添加一些事件监听，比如点击事件/提交事件等，这些事件会负责去响应页面上的所有其他点击事件。当有事件需要被响应时，React知道该调用哪个回调函数，因为我们已经将回调函数注册到React中了。

事件不一定非要注册在window.document上，如果容器时iframe，那么事件就会注册到iframe上；又或者容器是一个document fragement，一个shadow DOM，都可以用来注册顶层的事件。

React在分发事件的时候和原生事件一样，也有两个阶段：捕获阶段，冒泡阶段