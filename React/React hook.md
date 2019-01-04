#### React Hook

React发布了16.7.0-alpha版本，里面包含了一个重要的更新就是hooks。说白了，hooks的作用就是能使你在不使用class创建组件的情况下正常使用state以及在之前版本中其他class组件才有的一些特性。

在介绍hook之前有个问题需要先解决。

##### 为什么需要hook？

1.组件之间状态化的逻辑难以复用

React本身并没有现成的方法来使得组件之间实现逻辑复用。现有情况下，我们通常会用[render props](https://reactjs.org/docs/render-props.html)或者[HOC](https://reactjs.org/docs/higher-order-components.html)来实现一些逻辑的复用，但这两种方法在使用时都需要对组件结构做一些变更，这导致最终的组件有些笨重，而且也由于组件的嵌套，容易造成“嵌套地狱”（wrapper hell）。当组件嵌套层级很深时，数据的追踪也会有一些困难。所以说，React需要一种可以共享状态逻辑的方法。

2.复杂的组件比较难理解

在刚开始时，组件往往都比较简单，随着需求的增加，组件内部也会增加各种逻辑和副作用。组件的各个生命周期内部也会包含各种互不相干的逻辑。

