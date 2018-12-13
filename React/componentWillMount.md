### __`componentWillMount`__

​	`componentWillMount`是生命周期中第一个被调用的方法。这个方法只在初次render之前调用一次。因为这个方法在`render`之前调用，Native UI以及子元素都还没有创建，所以，在这个方法里还获取不到页面UI元素，更获取不到指向子元素的引用`refs`。

​	我们可以在`componentWillMount`中处理一些组件的配置，更新组件的state，总体来说就是为接下来的第一次render动作做准备。在这个方法里，组件的props和初始state都已经定义了。我们可以安全的使用`this.props`和`this.state`，此时获取到的值就是它们当前的值。所以，在这个方法里，我们可以做一些基于props值的计算和操作。

```react
import React from 'react';
import classNames from 'classnames';

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mode: undefined } ;
  }

  componentWillMount() {
    let mode;
    if (this.props.age > 70) {
      mode = 'old';
    } else if (this.props.age < 18) {
      mode = 'young';
    } else {
      mode = 'middle';
    }
    this.setState({ mode });
  }

  render() {
    return (
      <div className={ classNames('person', this.state.mode) }>
        { this.props.name } (age: { this.props.age })
      </div>
    );
  }
}

Person.defaultProps = { age: 'unknown' };

export default Person;
```

​	在上面的例子中，我们在render之前调用了`this.setState()`更新了当前state。如果我们需要根据传进来的`props`来计算state值，那么我们应该在这个地方放置我们的计算逻辑。

​	`componentWillMount()`还有一些其他用法，比如，注册全局事件，比如Flux store。如果组件需要响应一些全局的元素的事件，比如`window.resize`或者聚焦和失去焦点，那么可以把相关逻辑放在`componentWillMount()`内部（这地方因为一些基础元素Native UI还没渲染，所以我们只能选择一些全局或者说是高层的元素，比如`window`或者`document`）。