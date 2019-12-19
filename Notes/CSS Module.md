### 问题

* 作用域污染：CSS样式作用域为全局，不同组件之间样式容易相互污染
* JS和CSS无法共享变量

### 目标

* 编写健壮并且扩展方便的CSS
  * 面向组件：CSS也可以实现组件式架构
  * 沙箱化：组件样式仅作用于当前组件
  * 方便：开发体验好，无多余的学习成本

### 解决方案

#### CSS命名约定

规范化CSS命名，例如使用[BEM](http://getbem.com/)命名规范，通过命名来避免样式之间的污染。

但依然存在以下问题：

* JS CSS之间依然没有打通变量和选择器
* 随着组件的层级越来越深，命名也会越来越复杂

#### CSS in JS

抛弃CSS，使用JS写CSS，并内联样式。这样做虽然在JS中能访问到CSS变量了，但存在以下问题：

* 无法使用伪类、媒体查询等
* 样式代码抽取麻烦，容易产生大量重复代码
* 无法使用CSS预处理器

#### CSS Modules：使用JS管理样式模块

使用JS编译CSS文件，使其具有模块化能力：

* 通过编译，使每个类名具有全局唯一的命名 ----解决了命名冲突问题
* 编译后类名会应用到指定的元素上，因为命名唯一，所以只在局部有效 ---- 解决了样式污染问题
* JS中可以访问到类名变量 ---- 解决了JS和CSS共享变量问题

### 如何开启CSS Modules

这个请google

### CSS Modules在React中的实践

```jsx
import styles from './index.less';

function Login(){
  return (
    <div className={styles.header}>
      <div className={styles.navigate}></div>
    </div>
  )
}
```

渲染后：

```jsx
<div className='login_header___32osj'>
  <div className='login_navigate__2w27N'></div>
</div>
```

如果不想频繁的书写`styles.*`，可以使用[react-css-modules](https://github.com/gajus/react-css-modules#whats-the-problem)：

```jsx
import CSSModules from 'react-css-modules';
import styles from './index.less';

function Login(){
  return (
    <div styleName='header'>
      <div styleName='navigate'></div>
    </div>
  )
}

export default CSSModules(Table, styles);
```

这样的好处是：

* 不需要再花注意力到如何给样式类起一个驼峰式名称上面了
* 不需要频繁的引用`styles`对象了
* 能很容易区分使用CSS Modules的样式类和全局样式类

```jsx
<div className='global-css' styleName='local-module'></div>
```



[react-css-modules](https://github.com/gajus/react-css-modules)是提供了一些好处，但有个缺点就是，它是在代码运行时工作的，其本质上是一个高阶组件，运行时需要消耗一些性能，不是说我们提供不起这点性能，只是说如果能把工作放到编译期就更好了。

babel有个插件可以满足这个要求：[babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)

使用这个插件后，代码中直接使用`stylesName`放置样式类即可：

```jsx
import React from 'react';
import './table.css';

export default class Table extends React.Component {
  render () {
    return <div styleName='table'>
      <div styleName='row'>
        <div styleName='cell'>A0</div>
        <div styleName='cell'>B0</div>
      </div>
    </div>;
  }
}

// 不需要像上面那样再使用高阶组件包裹一次啦
```



### 总结一下

使用CSS Modules解决了CSS面临的模块化难题。

解决了全局污染问题，也满足了在JS中获取到样式选择器的要求

支持与CSS预处理器一起使用，学习成本低（几乎没有）。

react中使用[babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)来优化CSS Modules可以获得更好的开发体验。

