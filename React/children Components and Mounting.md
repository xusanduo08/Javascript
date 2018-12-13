Children Components  and Mounting

[原文链接](https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/birth/managing_children_components_and_mounting.html)

​	组件的`render()`方法执行完之后会返回一个React Element，其内部可以含有子元素，子元素内部又可以含有子元素。每个子元素都会像父元素那样走一遍它们自己的生命周期----constructor, default props, initial state, `componentWillMount()`  和`render()`。

​	在React中可以通过嵌套子元素轻松的构建复杂的布局。所以，__我们需要尽量使我们的组件简单，而只通过容器组件来嵌套这些组件然后实现具有复杂功能的组件__。

​	上面说到的是一种推荐和较好的开发方式，所以，在开发中我们会有很多较小的组件，记住，这些小组件也都有自己的生命周期，并且它们的生命周期经历都按照相同的过程进行。

