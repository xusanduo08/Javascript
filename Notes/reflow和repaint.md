#### reflow和repaint

下图给出了浏览器在加载完网页源码后做的事情。不同浏览器在某些地方有些细微的差别，但总体还是基本一致的：

![浏览器工作流程](E:\UserData\My Documents\GitHub\Javascript\img\render.png)

#####渲染过程

* 浏览器通过解析HTML代码构建出一个DOM树，HTML代码中的每个标签都在这棵树中有对应的节点。标签内部的一些文本在树中也有对应的文本节点。DOM树的根节点是`documentElement`（即`<html>`标签所代表的节点）
* 浏览器通过增加一些hack技术来解析CSS代码，这些hack技术包括`-moz`，`-webkit`等一些前缀。对其他一些不认识的扩展浏览器会主动忽视。标签自带的样式的优先级要低于用户引用的样式，放在style标签中的样式优先级最高。
* 接下来是比较有趣的一部分-----构建一个渲染树。渲染树和DOM树有些类似。但渲染树带有样式，所以如果你通过`display:none`隐藏了一个`div`，那么这个`div`就不会在渲染树上存在（但它在DOM树上是存在的）。类似的现象还出现在其他一些不可见的元素例如`head`标签以及其内部的其他标签。另外有一些DOM元素在渲染树中对应着多个节点，例如`<p>`标签中的每一行文本在渲染树中都有对应的渲染节点。渲染树中的节点被叫做框架（frame）或者盒子（box，也就是CSS里的盒模型，具体可查看[盒模型](https://juejin.im/entry/582f16fca22b9d006b7afd89ww)）。这些节点都具有CSS盒模型的一些属性----宽度，高度，边框，外边距等等。
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

对于渲染树来讲，其实就是DOM树的可见部分。对于一些不可见的节点比如头部和被隐藏的div直接忽略掉了。但是渲染树对于__每一行文本__都有对应的节点。

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

渲染树的根节点是包含其他所有节点的框架（frame）（或者叫盒子（box））。你可以把它当成是浏览器的的显示窗口，即浏览器所限制显示的区域。WebKit将渲染树的根节点称为`RenderView`，对应的这个根节点在CSS中叫做[initial containing block](http://www.w3.org/TR/CSS21/visudet.html#containing-block-details)。这个initial containing block就是从页面左上角（0， 0）到页面右下角（`window.innerWidth`, `window.innerHeight`）的一个矩形区域，称为视口。

要搞清楚浏览器是如何显示内容以及什么内容会被显示需要递归研究渲染树。

##### 重绘和回流

页面在绘制完毕后，改变构成渲染树的信息会产生如下的一个或者两个行为：

* 渲染树的一部分（或者整个渲染树）会重新生成，显示出来的节点的尺寸也会重新计算。这一过程称为__回流__。注意，至少会有一个初始页面会参与到回流当中。（注意：回流的产生只会因为节点的尺寸改变）
* 因为节点尺寸或者其他样式的变化（比如背景颜色）导致画面需要更新，这一过程称为__重绘__。

重绘和回流在性能上会有比较大的消耗，严重的会延缓页面的展示从而影响用户体验。

（译者：回流不一定会导致重绘）

##### 哪些行为会触发回流或者重绘

任何会改变构建渲染树所用信息的行为都会引起重绘或者回流，比如：

* 增加，删除或者更新节点
* 使用`display:none`隐藏节点（引发回流和重绘）；使用`visibility:hidden`隐藏节点（只有重绘，因为没有几何上的变化）
* 移动页面上的节点
* 增加样式
* 用户的操作，例如调整浏览器窗口大小，改变字体大小或者滚动页面

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

有一些比较特殊的回流消耗是很大的。修改body下的直接子节点可能不会影响到其他节点，这种消耗比较小。但假这个节点是页面上的顶级节点并且你还给这个节点添加了动画，那么这将使得整个页面都会有回流或者重绘，这种操作从性能消耗上来说是相当昂贵的。

##### 浏览器采取的优化

重绘或者回流消耗的性能都比较大，而浏览器在这方面有一定的优化。一种优化策略就是不进行重绘或者回流，或者说不会立即进行重绘或者回流。浏览器会维护一个队列用来放置页面的变更，然后批量的执行这些变更。本来每次变更都会有回流或者重绘，现在变成了多次变更只有一次回流或者重绘。浏览器可以向队列中添加需要执行的变更，并在某一个时间点或者变更达到一定数量后批量的执行它们。

当脚本中获取下面这些属性时脚本会强制浏览器去把当前变更队列中的变更执行掉并阻止浏览器去运行上面的优化策略：

* `offsetTop`，`offsetLeft`，`offsetWidth`，`offsetHeight`
* `scrollTop`/Left/Width/Height
* `clientTop`/Left/Width/Height
* `getComputedStyle()`或者IE浏览器中的`currentStyle`

上面都是一些获取某个节点样式信息的操作。无论何时进行这些操作，浏览器都会提供最新值。为了实现这一目的，浏览器会清空并执行当前的变更队列，然后根据需要回流或者重排。

举个例子，同时获取和设置某一个样式是很差劲的行为：

```javascript
//不要这么做
el.style.left = el.offsetLeft + 10 + "px";
```

##### 减少回流和重排

对编程者而言，减少回流和重排的副作用的另一个策略就是尽量少的去触发回流和重排，并尽量少的去获取元素样式（这样浏览器的优化策略就不会受到影响）。如何做：

* 不要一个个的去变更样式。



http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/

https://juejin.im/entry/582f16fca22b9d006b7afd89ww