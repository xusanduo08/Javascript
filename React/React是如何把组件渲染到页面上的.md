本质上讲，JSX只是为React.createElement(component, props, ...children)方法提供的语法糖。

    <MyButton color="blue" shadowSize={2}>
        Click me
    </MyButton>
    编译为：
    React.createElement(
        MyButton,
        {color: "blue", shadowSize: 2},
        "Click me"
    )

react/src/React.js   React.createElement() =>

react/src/ReactElement.js   createElement() => ReactElement() => return element



react-dom/src/client/ReactDOM.js   ReactDOM.render() => legacyRenderSubtreeIntoContainer()

=> new ReactRoot().render() => render方法是再ReactRoot的原型链上的一个方法，内部调用了updateContainer() => updateContainerAtExpirationTime() => scheduleRootUpdate()这个方法里面会将渲染任务放进一个队列里enqueueUpdate(current$$1, update), current$$1就是要发生更新的那个DOM

### React是如何把元素渲染到页面上的

将元素渲染到页面上靠的主要是`ReactDOM.render()`这个方法。`create-react-app`命令创建的项目index文件有如下代码：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
```

我们就来看看`<App />`是如何被渲染到id为`root`元素内部的。

以下的方法都在`ReactDOM`的内部，`render()`方法的调用堆栈大概下面这个样子：

```
render(element, container, callback) =>
legacyRenderSubtreeIntoContainer(null, element, container, false, callback) => 
root.render(children, callback) => 
updateContainer(element, container, parentComponent, callback) =>
updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback)=>
scheduleRootUpdate(current$$1, element, expirationTime, callback)=>
enqueueUpdate(fiber, update) 将更新放到队列
scheduleWork(fiber, expirationTime) 安排更新
```





