一个组件根据传入的props及自身内部的state来进行渲染。

* 优化点一：重写`shouldComponentUpdate()`方法

组件自带的生命周期函数`shouldComponentUpdate()`是最直接的可以进行性能优化的地方。如果该方法返回false，则组件不会re-render，而默认情况下，组件的`shouldComponentUpdate()`方法都是返回true的。

```javascript
shouldComponent(nextProps, nextState){
    //....
    return true;
}
```

`shouldComponentUpdate()`自带`nextProps`和`nextState`两入参，分别表示更新后的props和state。在方法内部，我们可以将nextProsp、nextState分别与this.props、this.state进行比较，来判断组件是否需要更新。

* 优化点二：组件继承`React.pureComponent`

`React.pureComponent`类在`shouldComponent()`方法中，使用浅比较对变化前后的props和state进行了比较。

```
shouldComponentUpdate(nextProps, nextState) {
	return !shallowEqual(this.props, nextProps) ||
			!shallowEqual(this.state, nextState);
}
```



如果props或者state不是太复杂，可以使用这种方法来优化组件。有一点要注意，浅比较也是需要消耗性能的，如果props或者state结构复杂，浅比较花费的时间超过re-render的时间，那最好还是另找其他优化的方法。

* 优化点三：列表渲染添加key值

了解react组件的diff算法的都知道，react会先比较新旧两颗虚拟DOM树的变化，然后计算出最小的变化最后再更新到页面上。没有key值时，虚拟DOM树之间的比较是同层、同位置节点之间的比较；有了key时，同层之间的节点会通过比较key的变化，来判断有哪些节点删除了，有哪些节点位置仅仅是排布顺序变更了（没有key值时，往列表中插入一个元素，可能会引起插入点后面的所有元素的删除和重建；有了key值后，react会自动的定位到需要变更位置的元素，然后移动他们的位置完成变更）。

* 优化点三：合适划分组件

一个react页面通常是由很多个react组件构成的，有些组件可能状态就是确定的，外界的任何变化都不会影响到该组件，这时候就需要把这个组件单独抽取出来，并重写其`shouldCompoentUpdate()`方法，使其总是返回false。

```jsx
<ScrollTable
	width={300}
	color='blue'
	scrollTop={this.props.offsetTop}
/>
```

上面这个组件，props中的width、color用于组件内容的展示，都是固定不变的；scrollTop用来定位组件的位置，是不断变化的。这种情况下，scrollTop变化时，整个组件需要重新渲染，包括组件的展示内容，这显然有点浪费（因为组件的展示内容没有变化，变化的仅仅是组件的位置）。这时候就可以将组件内容单独抽取一个组件，组件位置再抽取出一个组件。

```jsx
<Scroll scrollTop={this.props.offsetTop}>
	<Content
		width={300}
		color='blue'/>
<Scroll>
```

```javascript
class Content extends React.Component{
   //....
    shouldComponentUpdate(){
      return false
   }
   //....
}
```



因为`<Content />`组件不需要更新，所以可以`<Content />`的`shouldComponentUpdate()`，使其一直返回false，这样`<Scroll />`组件的更新就不会连坐到内部`<Content />`组件。

* 优化点四：使用短路逻辑或者样式控制组件的隐藏和显示
* 优化点五：容器组件和内容组件变化隔离