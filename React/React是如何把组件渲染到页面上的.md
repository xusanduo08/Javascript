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