### shouldComponentUpdate()

​	可以通过`shouldComponentUpdate`方法来避免不必要的re-render。默认情况下，这个方法返回true，也就是说，当代码里发起一次更新操作时，组件就会进行一次re-render。

​	对于每次更新，React默认不会去深比较`props`和`state`。如果`props`和`state`发生改变了，那么这时候可以进行re-render操作，但如果没有改变，也就不需要re-render了。

#### 避免不必要的re-render

​	`shouldComponentUpdate()`是生命周期函数中第一个可以优化的方法。在方法内部，我们可以获取到组件当前和之前的`props`和`state`，用来决定是否该继续走re-render流程。React中有个方法PureRenderMixin可以用来比较组件前后的`props`和`state`。

```javascript
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}

var ReactComponentWithPureRenderMixin = {
  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
};
```

​	上面的代码摘自React的addon部分源码。PureRenderMixin会自动给类添加`shouldComponentUpdate`方法，方法内使用上面代码中定义的`shallowCompare`来比较`props`和`state`的变化。

#### 突变和纯方法

​	有一点要提的是，上面PureRenderMixin创建的`shouldComponentUpdate`方法内部使用的是“浅比较”（shallowCompare）----单纯的使用“===”比较`props`和`state`前后的变化。因为没有处理数据突变的情况，所以也说PureRenderMixin比较“单纯”。

​	现在假设组件的`state`下有个data数组，我们使用`push`方法将一个元素添加到这个数组中：

```javascript
// psuedo code
this.setState({ data: [1, 2, 3] });

<MyComponent data={ this.state.data } />
```

​	如果在MyComponent使用`shallowCompare`来比较变化前后的`props.data`，那么它会以为没变，因为`props.data`前后都指向的是同一个数组（`currentProps.date === nextProps.data`）。因为组件没有感知到数据变化，所以也就不会去进行更新操作。我们的代码让数组发生了突变，所以，代码这里的是不纯的。

​	在Redux中，要求reducer必须是纯函数，也是为了避免数据发生突变的情况。如果你需要改变数据内某个属性，你需要克隆这份数据，并确保返回一整个最新的数据对象。这样做，能确保`shallowCompare`这个方法察觉到数据变化以便组件能够更新。

​	另外还可以使用防数据突变的工具库来避免数据的突变，比如[Immutable.js](https://facebook.github.io/immutable-js/)。这个工具创建的数据结构能够避免开发者无意中突变数据。有了不可突变的数据结构，我们就可以轻易的使用`shouldComponentUpdate`来验证组件的`props`和`state`是否发生了改变。

#### 从源头避免re-render

​	有如下的组件结构：

![nested Component structure](./img/07022148.png)

​	当组件A更新时，子组件也会随着更新。如果组件嵌套层数较深的话，对性能会造成较大浪费。可以给A组件添加`shouldComponentUpdate`方法，避免不必要的组件更新。

#### `forceUpdate`方法

​	当调用`forceUpdate`方法时，`shouldComponentUpdate`方法会被跳过（正如调用`setState`时，`componentWillReceiveProps`会被跳过），并且会将组件放到脏队列中。如果组件处于脏队列中，`shouldComponentUpdate`方法就会被忽略。因为我们选择的是强制更新，这意味着这个组件已经发生了改变，必须进行re-render操作。

​	因为`forceUpdate`是一个有点”残暴“的强制性的方法，所以在调用时需要多加小心和考虑。如果不断的调用该方法，会很容易陷入一个死循环。死循环的问题一般很棘手，所以，谨慎使用`forceUpdate`方法。

