#### reflow和repaint

下图给出了浏览器在加载完网页源码后做的事情。不同浏览器在某些地方有些细微的差别，但总体还是基本一致的：

![浏览器工作流程](E:\UserData\My Documents\GitHub\Javascript\img\render.png)

* 浏览器通过解析HTML代码构建出一个DOM树，HTML代码中的每个标签都在这棵树中有对应的节点。标签内部的一些文本在树中也有对应的文本节点。DOM树的根节点是`documentElement`（即`<html>`标签所代表的节点）
* 浏览器通过增加一些hack技术来解析CSS代码，这些hack技术包括`-moz`，`-webkit`等一些前缀。对其他一些不认识的扩展浏览器会主动忽视。标签自带的样式的优先级要低于用户引用的样式，放在style标签中的样式优先级最高。
* 接下来是比较有趣的一部分-----构建一个渲染树。渲染树和DOM树有些类似。渲染树带有样式，所以如果你通过`display:none`隐藏了一个`div`，那么这个`div`就不会在渲染树上存在（但它在DOM树上是存在的）。类似的还有一些其他一些不可见的元素例如`head`标签以及其内部的其他标签。









http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/

https://juejin.im/entry/582f16fca22b9d006b7afd89