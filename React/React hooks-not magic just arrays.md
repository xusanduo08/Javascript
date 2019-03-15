#### React hooks: not magic, just arrays

翻译自https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e



##### hooks的工作方式

__hooks使用规则__

使用hooks需要遵守一下两条规则：

* 不能在循环、条件语句和嵌套函数中使用hooks
* 只能在函数组件中使用hooks

第二条不用多说，想让函数组件具有某种行为就要把这种行为与组件联系起来。

第一条规则有些让人不明白，对于一个API来说，居然不能在循环、条件语句以及嵌套函数中使用，这很让人费解。接下来我就来解释一下。

__State management in hooks is all about arrays__

为了能有更好的理解，我们来看一下hooks的简单实现

_以下只是一个推测，能让我们理解hooks的工作，对于其内部原理我们暂不关心。_

