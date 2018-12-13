###React源码解读
#### 工具方法
- invariant:当条件为false时，会给出错误提示，开发态会给出具体错误，生产态会给出错误代码

2018.9.11
- React.js
  - 将方法挂载到React对象上，并将React暴露出来
- ReactBaseClasses.js
  - 基础类
    - setState:设置state的子集。只能用这个方法来改变state，同时应该把this.state认为是不可突变的。这个方法并不会保证在调用后立即更新this.state，因此在这个方法之后就立即引用this.state可能会获取到旧的值。对setState方法的多次调用可能并不会按照调用顺序同步依次运行，它们可能最终会被合并到一次变更中。我们可以提供一个回调函数放入setState第二个参数位置，当当前对setState的设置生效后，这个回调函数就会运行。如果setState的参数是一个函数，那么在未来某一个点这个函数会被调用，被调用时可以获取到当前最新的state，props以及context。此时，这些值可能与通过this.*方式获取到的不一样，主要是因此，我们提供的函数可能会在receiveProps之后shouldComponentUpdate之前运行，而此时新的state、props以及context并没有被赋值到this上。
    - forceUpdate：强制进行一次更新。当当前没有进行DOM操作时，我们才可以调用此方法。当state中某个深层次变量发生变化而setState没有被调用时，就可以通过调用forceUpdate来重新渲染组件。
    - PureComponent：默认对更新做浅比较的便捷类
- ReactCreateRef.js
  带有一个不可突变值的不可突变对象

react组件类中返回的的render方法其实都是对React.createElement方法的调用。
React.createElement方法返回一个代表DOM的对象，如下：
```javascript
{
    type: string | react类,
    props:{},
    key:string, //用来提升更新性能
    ref: DOM节点对象,
    $$typeof:'', //组件的标识信息
    _owner: //Record the component responsible for creating this element.
}
```