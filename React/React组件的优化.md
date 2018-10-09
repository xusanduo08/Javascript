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

要知道，null、undefined、Boolean值都可以作为react元素，所以可以使用null、undefined或者Boolean来占位。

```jsx
<Header>
	{flag && <div>moon</div>}
	<Nav>nav</Nav>
<Header>
```

比如上面的一个简单的组件，当flag为true时，会展示moon文本；flag为false时，这段表达式返回的就是false，在虚拟DOM树中，false就会和之前的相同位置的节点比较，比较后因为元素类型不一样（一个是false，一个是div），div会被卸载，换成false。false不会真的去渲染，但是作为一个react元素，会占着一个位置。这个时候，因为false的占位，后面元素的位置不会受到影响，又因为diff算法进行的是同层同位置节点比较，剩下的元素的位置都没有改变，所以变化前后都是自己和自己比较，这种情况避免了组件卸载又挂载造成的资源浪费（顶多会进行更新）。

同理，使用css控制元素的隐藏和显示也是一个道理，减少元素卸载再挂载造成的资源消耗。

* 优化点五：容器组件和内容组件变化隔离

通过容器来隔离外界的变化。容器是一个数据层，组件专门负责渲染，不进行任何数据交互，只根据得到的数据渲染响应的内容。

```react
class BudgetContainer extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    computeState() {
        return BudgetStore.getStore()
    }

    render() {
        return <Budget {...this.state}/>
    }
}
```

容器不应该有props和children，这样就能够把自己和父组件进行隔离，不会因为外界因素去重新渲染，也没必要重新渲染。

设想一下，如果设计师觉得这个组件需要移动位置，你不需要做任何的更改只需要把容器组件放到对应的位置，然后关心下容器内部数据的来源即可。唯一要做的就是在不同环境中编写不同的容器。

（最后一点我觉得有点代码重用的意思，和性能优化的关系有一点，但不大。主要在于用容器来隔离外界的变化，怎么隔离呢，shouldComponentUpdate始终返回false么？但是容器自身也需要更新啊，所以这时候shouldComponentUpdate不会那么简单。可以使用浅比较，所以要求容器的state不能太复杂，结构不能太深，以便于有变化发生时浅比较能够比较出变化来）

