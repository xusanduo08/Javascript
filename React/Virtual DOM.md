### React优化：Virtual DOM

这篇文章主要介绍React的一下几个方面：

1、React是如何将JSX渲染成页面；

2、React框架的瓶颈在哪里；

3、React在使用中的一些常见的错误。

​	React一直属于前端最热的框架之一，并且目前还没有衰弱的迹象。React的学习曲线很容易被人接受，当你学会了JSX语法以及`State`和`Props`的概念时，你就基本可以写React了。

​	但如果想真正的达到掌握React的目的，必须’think in React'。这篇文章有助于大家在掌握React的路上更近异步。先看下下面这个用React写成的table：

![table](./img/201807062044.png)

​	类似于上面的这个table，table的行数是很客观的，而且每行数据都是动态和处理过的，所以为了保证用户使用时的流畅体验，了解当前框架的细节就变得很重要了。

​	一般当问题出现时，页面会出现输入框反应迟缓，复选框选中需要很久，弹窗迟迟不出现等现象。

​	为了更好的解决这类问题，我们从组件定义开始到组件在页面上渲染出来为止。

#### JSX语法

​	我们在写组件的时候用的都是JSX语法，一种JS和HTML混在一起的写法。对于浏览器来讲，它是不认识JSX这种语法格式的。浏览器只认识原生的Javascript，因此，我们需要把JSX语法转化成原生的Javascript。下面是个用JSX写的一个带有class属性和一些文本内容的一个div：

```jsx
<div className='cn'>
  Content!
</div>
```

​	上面这段JSX代码，转化成正常的Javascript代码的结果就是对一个带参函数的调用：

```jsx
React.createElement(
  'div',
  { className: 'cn' },
  'Content!'
);
```

​	仔细看一下上面这个函数的调用。这个函数的调用有三个入参，第一个是元素类型（element type），对于原生的HTML元素来讲，就是一个代表标签名的字符串；第二个是元素上的属性所组成的对象，如果元素上没有属性，那么这个对象就是一个空对象；剩下的参数都是元素的子类元素。因为文本内容也是子类元素，所以字符串’Content!‘就被放到了第三个参数的位置。

​	当有多个子类元素的时候：

```jsx
<div className='cn'>
  Content 1!
  <br />
  Content 2!
</div>
```

```javascript
React.createElement(
  'div',
  { className: 'cn' },
  'Content 1!',              // 1st child
  React.createElement('br'), // 2nd child
  'Content 2!'               // 3rd child
)
```

​	现在上面这个函数的调用有了5个参数：元素类型，属性对象，3个子类元素。因为其中一个元素也是React所知的原生的HTML标签（`<br />`），所以它也会被当成一个函数调用来处理。

​	目前为止我们提到了两种类型的子类元素：一种是字符串，还有一种会调用`React.createElement`。另外还有几种值可以作为子类元素的参数：`false`,`null`,`undefined`,`true`，数组还有React组件。

​	因为子类元素可以被放到一起作为一个元素来传递，所以数组也可以当成子元素。

```javascript
React.createElement(
  'div',
  { className: 'cn' },
  ['Content 1!', React.createElement('br'), 'Content 2!']
)
```

​	React的厉害不在于我们可以在JSX中使用原生的HTML标签，而主要在于在JSX中还可以引入另一个我们自己创建的组件，比如：

```jsx
function Table({ rows }) {
  return (
    <table>
      {rows.map(row => (
        <tr key={row.id}>
          <td>{row.title}</td>
        </tr>
      ))}
    </table>
  );
}
```

​	组件的存在使得我们可以把我们的模板分割成若干个可重复使用的代码块。在上面的函数式组件中，我们接受一个带有表格行数据的数组，然后`<table>`作为元素类型，行作为子类元素调用`React.createElement`，并返回其运行结果。

​	当我们在代码中这样写时：

```jsx
<Table rows={rows} />
```

​	实际从浏览器角度，代码是这样的：

```javascript
React.createElement(Table, { rows: rows });
```

​	这地方要注意，第一个参数已经不是一个描述HTML标签的字符串了，变成了一个刚刚定义组建的函数的一个引用。组建的属性（attributes）就是现在的props。

#### 把组件渲染到页面上

​	现在我们已经把JSX组件转译成了原生的Javascript代码，有了一大堆函数调用，这些函数的参数会被其他函数调用，现在的问题是，这个函数是怎么变成DOM元素并组成一个页面的？

​	事实上，我们有一个`ReactDOM`库，它有一个`render`方法来做这些事情：

```javascript
function Table({ rows }) { /* ... */ } // defining a component

// rendering a component
ReactDOM.render(
  React.createElement(Table, { rows: rows }), // "creating" a component
  document.getElementById('#root') // inserting it on a page
);
```

​	当`ReactDOM.render`被调用时，`React.createElement`也会被调用并返回下面的对象：

```javascript
// There are more fields, but these are most important to us
{
  type: Table,
  props: {
    rows: rows
  },
  // ...
}
```

​	__这些对象就是React中所说的虚拟DOM（Virtual DOM）。__

​	在渲染时，这些对象会相互比较（译者：说的应该是更新时候的diffing过程）并最终转化成真实的DOM（real DOM，和virtual DOM相对）。

​	看下面这个例子，一个带有class属性和几个子元素的div：

```jsx
React.createElement(
  'div',
  { className: 'cn' },
  'Content 1!',
  'Content 2!',
);
```

​	转成虚拟DOM就是：

```javascript
{
  type: 'div',
  props: {
    className: 'cn',
    children: [
      'Content 1!',
      'Content 2!'
    ]
  }
}
```

​	注意，在`React.createElement`中，子类元素还是单独列出来的参数，到这里，变成了以children为key值的输入props对象的一个属性。由此可以看出，无论children以什么样的样式传递，数组还是列表，最终在虚拟DOM中都会以数组形式放到一起。

​	说的明白些，我们可以在JSX中就把children作为属性传递到props中，结果都是一样的：

```javascript
<div className='cn' children={['Content 1!', 'Content 2!']} />
```

​	虚拟DOM构建完毕后，`ReactDOM.render`就会尝试把虚拟DOM转换成真实的DOM来让浏览器显示，转换规则如下：

```t
1.如果type字段是个代表标签名的字符串----创建这个标签，并附带上props中所有的属性；
2.如果type字段是个函数或者是个类----调用这个函数或者创建这个类，并根据结果递归该过程；
3.如果props中含有children----逐个对子元素调用上面的逻辑并将结果放到父元素的DOM节点中。
```

​	根据上面的结果，我们的Table组件在页面渲染的结果如下：

```html
<table>
  <tr>
    <td>Title</td>
  </tr>
  ...
</table>
```

#### 重建DOM

​	注意这里说的“重建”！当我们想更新一个页面而不是全部替换时，React的魔法就开始起作用了。有几种方法可以用来更新页面。首先，最简单的一种----重复对相同节点调用`ReactDOM.render`方法。

```javascript
// Second call
ReactDOM.render(
  React.createElement(Table, { rows: rows }),
  document.getElementById('#root')
);
```

​	第二次调用时，上面的代码的表现已经和我们所看到的不一样了。它不会重新创建整个DOM节点然后把这些节点放到页面上，而是首先先通过一致性校验算法--diffing算法--来判断节点树中哪些部分需要更新，哪些根本不需要动。

​	所以，diffing算法到底是怎么工作的？我们来看下下面几个场景，理解这几个场景对优化我们的应用很有帮助。首先我们看到的是虚拟DOM中用来代表节点的对象。

* 场景一：type是个字符串，type没变，props也没变。

```javascript
// before update
{ type: 'div', props: { className: 'cn' } }

// after update
{ type: 'div', props: { className: 'cn' } }
```

​	这种情况很简单，保持原有DOM，不做任何处理。

* 场景二：type保持相同字符串没变，props改变

```javascript
// before update:
{ type: 'div', props: { className: 'cn' } }

// after update:
{ type: 'div', props: { className: 'cnn' } }
```

​	type仍然代表着原生的HTML元素，React会通过原生的DOM API来改变元素的属性（properties），并不会去从DOM树中移出节点。