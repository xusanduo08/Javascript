#### reflow和repaint

下图给出了浏览器在加载完网页源码后做的事情。不同浏览器在某些地方有些细微的差别，但总体还是基本一致的：

![浏览器工作流程](../img/render.png)

##### 渲染过程

* 浏览器通过解析HTML代码构建出一个DOM树，HTML代码中的每个标签都在这棵树中有对应的节点。标签内部的文本在树中也有对应的文本节点。DOM树的根节点是`documentElement`（即`<html>`标签所代表的节点）
* 浏览器通过增加一些hack技术来解析CSS代码，这些hack技术包括`-moz`，`-webkit`等一些前缀。对其他一些不认识的扩展浏览器会主动忽视。标签自带的样式的优先级要低于用户引用的样式，而放在style标签中的样式优先级又是最高的。
* 接下来浏览器会构建一个渲染树。渲染树和DOM树有些类似。但渲染树带有样式，所以如果你通过`display:none`隐藏了一个`div`，那么这个`div`就不会在渲染树上存在（但它在DOM树上是存在的）。类似的现象还出现在其他一些不可见的元素例如`head`标签以及其内部的其他标签。另外有一些DOM元素在渲染树中对应着多个节点，例如`<p>`标签中的每一行文本在渲染树中都有对应的渲染节点。渲染树中的节点被叫做frame或者box（也就是CSS里的盒模型，具体可查看[盒模型](https://juejin.im/entry/582f16fca22b9d006b7afd89ww)）。这些节点都具有CSS盒模型的一些属性----宽度，高度，边框，外边距等等。
* 渲染树构建完成后，浏览器就可以根据这颗渲染树来绘制页面到屏幕上。

##### 森林和树

看个例子：

```html
<html>
<head>
  <title>Beautiful page</title>
</head>
<body>
    
  <p>
    Once upon a time there was 
    a looong paragraph...
  </p>
  
  <div style="display: none">
    Secret message
  </div>
  
  <div><img src="..." /></div>
  ...
 
</body>
</html>
```

上面的代码的每一个标签和节点间的__每一段文本__都在DOM树上有对应节点（为了简便，我们暂且忽略空白）。

```javascript
documentElement (html)
    head
        title
    body
        p
            [text node] // 每一段文本都有对应节点
		
        div 
            [text node]
		
        div
            img
		
        ...
```

__渲染树其实就是DOM树的可见部分__。对于一些不可见的节点比如头部和被隐藏的div在渲染树中是不存在的。对于文本的处理渲染树和DOM树有些不一样，渲染树对于__每一行文本__都有对应的节点。

```
root (RenderView)
    body
        p
            line 1 // 每一行文本都有对应节点
	    	line 2
	    	line 3
	    	...
	    
		div
	    	img
	    
		...
```

渲染树的根节点是包含其他所有节点的frame（或者叫box）。你可以把它当成是浏览器的的显示窗口，即浏览器所限制显示的区域。WebKit将渲染树的根节点称为`RenderView`，对应的这个根节点在CSS中叫做[initial containing block](http://www.w3.org/TR/CSS21/visudet.html#containing-block-details)。这个initial containing block就是从页面左上角（0， 0）到页面右下角（`window.innerWidth`, `window.innerHeight`）的一个矩形区域，称为__视口__。



##### 重绘和回流

页面在绘制完毕后，改变构成渲染树的信息会产生如下的一个或者两个行为：

* 渲染树的一部分（或者整个渲染树）会重新生成，显示出来的节点的尺寸也会重新计算。这一过程称为__回流__（其实就是布局的重新计算过程，又叫重排）。注意，至少会有一个初始页面会参与到回流当中。（回流的产生只会因为节点的尺寸改变，或者说布局的改变）
* 因为节点尺寸或者其他样式的变化（比如背景颜色）导致画面需要更新，这一过程称为__重绘__。

重绘和回流在性能上会有比较大的消耗，严重的会延缓页面的展示从而影响用户体验。

（回流一定会导致重绘，而重绘不一定是回流引起的）

##### 哪些行为会触发回流或者重绘

任何会改变构建渲染树所用信息的行为都会引起重绘或者回流，比如：

* 增加，删除或者更新节点（增加和删除-----回流+重绘，更新-----回流或者重绘）
* 使用`display:none`隐藏节点（引发回流和重绘）；使用`visibility:hidden`隐藏节点（只有重绘，因为没有几何上的变化）
* 移动页面上的节点（回流+重绘）
* 增加样式
* 用户的操作，例如调整浏览器窗口大小，改变字体大小或者滚动页面（回流+重绘）

看下面几个例子：

```javascript
var bstyle = document.body.style; // cache
bstyle.padding = "20px"; // 回流，重绘
bstyle.border = "10px solid red"; // 回流，重绘

bstyle.color = "blud"; // 重绘，没有几何上的变化
bstyle.backgroundColor = "#fad"; // 重绘，没有几何上的变化

bstyle.fontSize = "2em"; // 回流，重绘

// 增加新节点----回流，重绘
document.body.appendChild(document.createTextNode('dude!'));
```

有一些比较特殊的回流消耗是很大的。修改body下的某个单独子节点可能不会影响到其他节点，这种消耗比较小。但假这个节点是页面上的顶级节点并且你还给这个节点添加了动画，那么这将使得整个页面都会有回流或者重绘，这种操作从性能消耗上来说是相当昂贵的。

##### 浏览器采取的优化

重绘或者回流消耗的性能都比较大，而浏览器在这方面有一定的优化。一种优化策略就是不进行重绘或者回流，或者说不会立即进行重绘或者回流。浏览器会维护一个队列用来放置页面的变更，然后批量的执行这些变更。本来每次变更都会有回流或者重绘，现在变成了多次变更只有一次回流或者重绘。浏览器可以向队列中添加需要执行的变更，并在某一个时间点或者变更达到一定数量后批量的执行它们。

当脚本中获取下面这些属性时脚本会强制浏览器去把当前变更队列中的变更执行掉并阻止浏览器去执行上面的优化策略：

* `offsetTop`，`offsetLeft`，`offsetWidth`，`offsetHeight`
* `scrollTop`/Left/Width/Height
* `clientTop`/Left/Width/Height
* `getComputedStyle()`或者IE浏览器中的`currentStyle`

上面都是一些获取某个节点样式信息的操作。无论何时进行这些操作，浏览器都会提供最新值。为了实现这一目的，浏览器会清空并执行当前的变更队列，然后根据需要回流或者重绘。

举个例子，同时获取和设置某一个样式是很差劲的行为：

```javascript
//不要这么做
el.style.left = el.offsetLeft + 10 + "px";
//因为在获取offsetLeft时可能会触发回流或者重新，设置样式后又会触发回流或者重绘
```

##### 减少回流和重绘

对编程者而言，减少回流和重排的副作用的另一个策略就是尽量少的去触发回流和重绘，并尽量少的去获取元素样式（这样浏览器的优化策略就不会受到影响）。如何做：

* 不要一个个的去变更样式。比较好且维护起来方便的方法是更改元素的类名而不是样式。但这仅对静态样式而言。对于动态样式，比较好的是去编辑`cssText`属性而不是去手动获取和编辑元素的样式。

```javascript
//
var left = 10, top = 10;
el.style.left = left + "px";
el.style.top = top + "px";

//better
el.className += "theClassname";

//当样式值需要动态计算时
//better
el.style.cssText += ";left:" + "px;top" + "px;";
```

* 离线并且批量的进行变更。
  * 使用`documentFragement`承载变更
  * 克隆要更新的节点，然后在副本上进行变更操作，最后将原始节点用这个副本更新掉。
  * 使用`display:none`隐藏要更新的节点（一次回流，一次重绘），然后对节点进行更新，更新结束后再去掉隐藏样式使节点显示（再一次回流和重绘）。这种方式用两次回流和重绘避免了潜在的可能的多次的回流和重绘。
* 不要频繁的去获取节点的computed style。如果需要节点的computed style，可以一次性获取全量样式，并存储到本地，接下来的计算从本地的存储中获取相关值。

```javascript
//不要这样做
for(big; loop; here){
    el.style.left = el.offsetLeft + 10 +"px";
    el.style.top = el.offsetTop + 10 + "px"
}

// better
var left = el.offsetLeft, top = el.offsetTop, esty = el.style;
for(big; loop; here){
    left += 10;
    top += 10;
    esty.left = left + "px";
    esty.top = top + "px";
}

```

* 总体而言，在更新节点时需要考虑渲染树的变更及为了使你的变更生效而所需要的性能消耗。例如，body中有一个使用绝对定位的子元素，当在这个子元素上添加动画时并不会对其他节点产生太多影响，并且动画所涉及区域的其他节点可能只需要重绘而不需要回流（这里暗含的一个优化点就是动画尽量放在绝对或者固定定位的元素上）。



##### 总结

* 渲染树-----DOM树的可见部分
* 渲染树中的节点称为frames或者boxes
* 重新计算渲染树的布局称为在火狐中称为回流，在其他浏览器中称为重排
* 根据渲染树重新计算的结果去渲染页面称为重绘

##### 扩展阅读

- Mozilla: [notes on reflow](http://www.mozilla.org/newlayout/doc/reflow.html)
- David Baron of Mozilla: Google tech talk on [Layout Engine Internals for Web Developers](http://www.youtube.com/watch?v=a2_6bGNZ7bA)
- WebKit: [rendering basics](http://webkit.org/blog/114/webcore-rendering-i-the-basics/) - 6-part series of posts
- Opera: [repaints and reflows](http://dev.opera.com/articles/view/efficient-javascript/?page=3#reflow) is a part of an article on efficient JavaScript
- Dynatrace: [IE rendering behavior](http://blog.dynatrace.com/2009/12/12/understanding-internet-explorer-rendering-behaviour/)



https://zhuanlan.zhihu.com/p/29879682

http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/

https://juejin.im/entry/582f16fca22b9d006b7afd89