#### Re-rendering and Children Updates

[原文链接](https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/rerendering_and_children_updates.html)

​	现在我们再来说一下`render`方法。当组建的`props`和`state`发生改变后，就需要让这些改变体现到组件和子组件上，这时候初次渲染时的一些规则在这个地方也一样适用。

​	在re-render时，组件和子组件的产生和初次渲染有较大差别。

![re-render](./img/201807111924.png)

​	React在这个时候会比较`render`方法前后返回的值是否发生变化，对于子元素，会将`props.children`中的元素按照索引比较前后变化，或者，如果子元素都带有key值，则通过key值比较是否发生变化。通过比较，React会知道我们是否有新的实例生成（A.3），是否需要移除已有实例（A.0.1）或者是否需要更新已有实例（A,A.0,A.0.0）。

​	如果key值相同，仅仅是props发生了变化，则仅将props传到组件内部，然后开始组件的更新过程（这时候的更新就只是通过原生的DOM API改变元素的属性，对DOM结构不做更改）。如果增加了新组件或者变更了组件的key值，React就会创建新的组件实例，然后这个组件就会进入到挂载阶段。