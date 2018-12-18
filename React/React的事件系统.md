#### React的事件系统

React会使用`addEventListener`在最顶层元素（比如window.document）上添加一些事件监听，比如click事件/submit事件等，这些事件会负责去响应页面上的所有其他点击事件。当有事件需要被响应时，React知道该调用哪个回调函数，因为我们已经将回调函数注册到React中了。

对每种事件类型，React都会有__一个__对应的事件去触发。也就是说，顶层元素的某个事件在需要时会负责去触发其他元素所绑定的同种类型的事件。假设有以下代码：

```jsx
const ExampleComponent = () => (
  <div onClick={onClick}>
    <div onClick={onClick} />
  </div>
)
```

以上代码渲染后我们在浏览器控制台运行`getEventListener(document)`会得到下面的输出结果：

```javascript
{click: Array(1)}
```

每个事件类型所对应的监听都有各自单独的循环系统。所以如果我们额外添加一个`keydown`事件，然后在控制台再次运行`getEventListener(document)`会得到下面的结果：

```javascript
{click: Array(1), keydown: Array(1)}
```



React内部实现了合成事件，这使得在不同浏览器中，每种事件的参数类型都是一样的。

因为React为每种事件类型都注册了单独的监听器，所以当事件发生时React需要去分发事件，就是说React需要去调用此次应该响应事件的那个回调函数。



```
Forward these native events (with the associated top-level type used to trap it) to `EventPluginHub`, which in turn will ask plugins if they want to extract any synthetic events.
```

`EventPlugHub`会集中处理事件，当有事件发生时，它也会负责将事件分发到指定的处理插件上。每个事件插件可能会负责抽取和处理多种类型的事件，比如，`SimpleEventPlugin`负责处理鼠标事件和键盘事件；`ChangeEventPlugin`则负责`onChange`事件。

合成事件的存在使得在不同浏览器中同种类型的事件的参数都是一样的，这些合成事件都是由各自对应的插件来实现的。注意，每个合成事件对象都是有缓存的，同种类型的事件使用的都是同一个事件对象。当事件发生时，对应的事件对象会被重置，属性会重新赋值，然后再分发到指定的回调函数中。



```
The `EventPluginHub` will then process each event by annotating them with "dispatches", a sequence of listeners and IDs that care about that event.
```

实际中，每种事件类型可能对应多个处理函数。由不同的事件处理函数和对应的fiber节点构成的分发器会累积保存起来，当事件发生时，`EventPluginHub`会使用这些分发器去处理事件。



```
The `EventPluginHub` then dispatches the events.
```

事件发生后，React会遍历之前累积的分发器，然后发布事件 ，对应的事件处理方法就会被触发。



事件不一定非要注册在window.document上，如果容器是iframe，那么事件就会注册到iframe上；又或者容器是一个document fragement，一个shadow DOM，都可以用来注册顶层的事件。

React在分发事件的时候和原生事件一样，也有两个阶段：捕获阶段，冒泡阶段。

RN中的事件处理和React DOM的不一样，这两者不要混淆。