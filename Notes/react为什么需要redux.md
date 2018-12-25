#### React为什么需要redux？

1.React有props和state。props是父级分发下来的属性，state意味着组件内部可以自行管理的状态，__整个React应用的数据只能单向向下分发或者自行内部消化__，React没有数据向上回溯的能力。

2.在React内，使两个独立的组件沟通的方法往往是提升state，将state放到共有的父组件中来管理，再作为props分发给子组件。

3.子组件改变父组件state的方法一般是通过事件触发父组件声明好的回调，这样就出现了一个模式：数据总是单向从顶层向下分发的，只有子组件回调在概念上可以回到state顶层影响数据。

4.为了一步到位，干脆把所有state集中放到所有的组件顶层，然后分发给所有组件。

5.为了有更好的state管理，就需要一个工具作为更专业的顶层state分发给所有React应用，这就是Redux。

Redux是如何实现上面的需求的：

* 需要回调通知state （相当于父级回调方法里的参数）-> action
* 需要根据回调处理（等同于父级回调方法） -> reducer
* 需要state -> store

对于Redux来说重点是action、reducer、store：

* action是一个纯声明式的数据结构（原生的js对象），只提供事件的所有要素，不提供逻辑。action描述了发生了什么事情和所发生事情的相关数据，但是针对发生的事情，程序该采取什么动作，action并不负责和关心。
* reducer是一个匹配函数，action的发送是全局的：所有reducer都可以捕捉到并匹配是否与自己相关，相关就拿走action中的数据进行逻辑处理，修改store中的状态，不相关就不对state做处理并原样返回。
* store负责存储状态，并可以被react api回调，发布action

react-redux：将React和Redux联系起来：

* Provider是一个最顶层的组件，负责向下方传递state。它通过将store放在上下文中，所有被connect的组件都可以从上下文中获取到store。
* connect，最复杂的部分：connect是一个组件，它从上下文中获取到store，进而得到state，然后通过mapStateToProps、mapStateToDispatch将state处理后以props的形式传递给它所包括的组件。
  * mapStateToProps(state, ownProps, ...)：通过对state处理，分拣出组件需要的Redux状态，最后返回一个对象，这个对象会以props的形式传给组件。
  * mapDispatchToProps(dispatch, ownProps, ...)：返回一个对象，将声明好的回调作为props注入到组件里。如果没有这个参数，react-redux会将dispatch作为props传入组件中，在组件内可以直接调用dispatch(action)来表明一个动作的发生。



