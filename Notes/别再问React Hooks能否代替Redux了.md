#### 别再问React Hooks能否代替Redux了

> 原文地址：https://medium.com/swlh/stop-asking-if-react-hooks-replace-redux-448c54d79551

一些同事经常变着法的问我同一个问题：

“如果项目中已经在使用hooks了，那还有必要引入Redux么？”

“React Hooks的出现是不是意味Redux可以废弃？我是不是可以用hooks来做Redux可以做的事情了？”

经过一番搜索，我发现网上有好多人在问这一类问题。

简单的说，这个问题的答案是：NO！

如果再回答的细致并且礼貌一点就是：这取决于你的项目。

事实上，我更倾向于这样的回答：我不太确定你是否知道自己在问啥。

这个问题从根本上讲是有缺陷的，原因有以下几个：

##### Redux从始至终都是一个可选项

根据 Dan Abramov（Redux的作者之一）的文章，[你或许不需要Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)，我们可以得出一个结论：如果我们根本不需要某个东西，那我们也就不需要替换这样东西。

如果需要在React中使用Redux，你需要引入React-Redux代码库。众所周知，代码库的引入会增加应用打包后的体积，而打包后代码的大小又直接影响着应用的加载时间。所以，除非项目真的需要，否则没有必要去引入像jQuery、Redux、MobX甚至React这些代码库。

当有人问hooks是否会替代Redux时，往往让人觉得他们的项目需要用这两者中的一个。但事实不是这样。如果你现在开发的应用并没有很多的状态需要存储，又或者你的组件层次比较简单，不存在深层次的props传递，那么就没必要去使用一个全局状态管理库。直接使用React现有的功能就足以管理好应用内的状态，用不用hooks都可以。

如果你应用内的状态或者组件层次如古树树根一般复杂，你也可以不用状态管理库。这种情况下props的传递或许会有一些复杂，但React已经提供了包含hooks在内的工具以确保你的状态能管理的井井有条。Redux虽然轻量，但配置复杂，打包后还会增加应用体积，这中间存在着一些权衡。不在项目中使用Redux的理由很多，总而言之，你要记住，Redux是一个可选项。

反过来说，使用Redux的原因也有很多。如果你的项目中一开始就用了Redux，那肯定是有原因的，比如项目需要一个可预测的，单一的数据源来使应用代码在复杂状态中保持条理，或者中间件，或者Redux开发者工具。如果你之前有理由使用Redux，那么现在React hooks并不会使这些理由失效。因此，如果你之前需要Redux，那你现在有可能依然需要redux。

##### React hooks和Redux所解决的并不是同一个问题

Redux是一个状态管理库。Hooks则是最近发布的React所提供的一项新功能，它允许在函数式组件使用一些之前只能在类组件中使用的功能。

使用函数组件替换类组件会让状态管理库过时么？不！

根据官方文档，React hooks的诞生主要为了解决以下三个痛点：

* 在类组件之间复用逻辑困难
* 生命周期方法中常包含一些让人困惑的无关联的逻辑
* 类组件对人和机器都有一些理解上的困难

可以看到，这三个原因没有一个和状态管理有关。

但是话又说回来，React hooks确实给了我们几个管理应用状态的选项。比如`useState`，`useReducer`和`useContext`几个方法所提供的管理状态的功能比原来React带有的管理状态的方法更好，更有条理。

Hooks并不是什么魔法，不会让状态管理库过时。

##### Hooks不会让你的app具有之前版本React所不具有的功能

有了hooks之后，你可以在函数组件中使用之前只能在类组件中的功能，但这并不会让函数组件具有类组件没有的功能，换句话说，它并没有增加组件的新功能，只是提供了一种更有条理管理代码和复用代码的方式。Hooks不会让你应用更好，只会让开发者体验更好。

`useState`和`useReducer`是管理组件状态的两种方式，它们的功能和类组件中的`this.state`以及`this.setState`一样。但对于深层次的props传递问题，这些方法依然起不到大的效果。

`useContext`是一个大家认为可以将Redux打入冷宫的一个方法，因为它可以解决深层次props传递的问题，但这个方法并不是什么新的功能。[Context API](https://reactjs.org/docs/context.html)已经存在好久了，`useContext`只是让大家在使用context时不再需要`<Consumer>`来包裹组件。虽然一些开发者喜欢用context来保存一些全局变量，但context并不是为此而设计的。根据文档：

> Context被设计用来保存对组件树而言需要全局共享的数据，比如当前用户，主题，又或者语言。

换句话说，保存在context中的数据不应该频繁的更新。

文档中还建议少用context，因为“它让代码难以复用”。虽然可以用context来管理状态，但那毕竟不是context被设计出来的初衷。

总结一下，React hooks的出现并不会引起Redux的灭亡。如果你看一眼[React-Redux最近更新的文档](https://react-redux.js.org/next/api/hooks)，你会发现：

##### React-Redux已经有了自己的hooks

React hooks的引入使得React-Redux代码更加健壮，也移除了一些痛点。这与“替代React-Redux”相去甚远。

我在另一篇文章中[深入研究了React-Redux中的hooks](https://medium.com/swlh/clean-up-redux-code-with-react-redux-hooks-71587cfcf87a)，以下是这篇文章中的重点。在hooks出现之前，你需要定义`mapStateToProps`和`mapDispatchToProps`方法，并将你的组件使用`connect`包裹，产生的高阶组件会将`dispatch`方法以及store中数据通过你上面提供的两个方法处理后作为props，传入到你的组件中。

来看一个简单的计数器的例子（虽然简单到不需要引入Redux，但为了说明问题，还是引入一下）。假设我们已经定义了store，以及`increment`和`decrement`两个actions creator：

```javascript
import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {count, increment, decrement} = this.props;

    return (
      <div>
        <h1>The count is {count}</h1>
        <button onClick={() => increment(count)}>+</button>
        <button onClick={() => decrement(count)}>-</button>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  count: store.count
});

const mapDispatchToProps = dispatch => ({
  increment: count => dispatch(actions.increment(count)),
  decrement: count => dispatch(actions.decrement(count))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

相当繁琐。假如可以不用把我们的组件包括在高阶组件中就能使用redux store，这样不是更简便么？-----这就是redux中hooks的目的。Hooks解决了代码复用问题，同时减少了高阶组件包裹导致“包裹地狱”的可能。下面是同样的组件，但使用了React-Redux hooks功能：

```javascript
import React from 'react';
import * as actions from '../actions/actions';
import {useSelector, useDispatch} from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const count = useSelector(store => store.count);

  return (
    <div>
      <h1>The count is {count}</h1>
      <button onClick={() => dispatch(actions.increment(count))}>+</button>
      <button onClick={() => dispatch(actions.decrement(count))}>-</button>
    </div>
  );
}

export default App;
```

是不是很简洁？简而言之，`useSelector`允许你将redux store中的一些数据作为变量保存在你的组件中。`useDispatch`也很简单，它提供了`dispatch`方法，你可以用来发起数据更新操作到Redux store。总而言之，你不用再写那些丑陋的映射函数或者把你的组件包裹在`connect`方法内了。现在，你的组件包含了一切该有的功能，而且代码比以前更加简短，可读性更高，更有条理。

##### 没有必要将React hooks和Redux放在对立面

经过上面的讲解，能看出这两种技术能很好的相互成全。React hooks不会取代Redux，它只是提供了一个新的，也许能更好的组织你的代码的方式。如果你决定使用Redux，hooks或许能帮你写出更高内聚的组件。

所以，不要再问“React hooks会不会取代Redux”了？

相反，我们应该问问自己“我们在写的应用需要那种方式来管理状态？Redux在我这个项目上是否合适，是否大材小用了？是否该用hooks，还是我应该坚持使用类组件？如果我使用Redux和React hooks（或者MobX和React hooks，或者仅仅是jQuery和Redux-----这取决于你的项目），我该如何让这些技术相互补充，和谐工作呢？”

