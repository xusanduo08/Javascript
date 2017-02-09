### defer和async

[`defer`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)：This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing `DOMContentLoaded`. The `defer` attribute should only be used on external scripts.

​	翻译过来就是：`defer`用来使外部的的脚本在文档解析完毕之后、`DOMContentLoaded`事件触发前运行，而且`defer`属性只用于外部脚本。

[`async`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)：Set this Boolean attribute to indicate that the browser should, if possible, execute the script asynchronously. It has no effect on inline scripts (i.e., scripts that don't have the **src** attribute).

​	翻译过来就是：`async`属性使得脚本的执行和文档的加载同时进行

​	一般一个页面的js文件都放在`body`标签的底部，这是为了防止js的加载和运行阻塞DOM的加载。当然也有js文件放在`body`顶部的，这个时候为了不让js文件的加载和运行阻塞DOM的解析，就可以使用`defer`和`async`属性。

​	三句话解释`defer`和`async`：

​	1.`<script src="script.js"></script>`没有`defer`或`async`，浏览器会立即加载并执行指定的脚本，“立即”是说解析到这个标签，就开始加载，`</script>`后面的元素的加载先放一边，先只加载js脚本并执行，专业的说法，js脚本的加载阻塞了后续文档的加载和渲染，反应在浏览器上就是空白。

​	2.`<script async src="script.js"></script>`有`async`，加载和渲染后续文档元素的过程将和`script.js`脚本的加载和执行一起进行（异步），也就是说，你加载你的js脚本，我继续加载我后面的文档内容，互不干扰，而且，你加载完脚本后你直接运行好了，不用等谁。

​	3.`<script defer src="script"></script>`有`defer`,加载和渲染后续文档元素的过程将和`script.js`脚本的加载和执行一起进行（异步），这点和`async`相同，不同的是，有`defer`的情况下，js脚本加载完毕后，要等到所有元素解析完成后，`DOMContentLoaded`事件触发之前完成。

​	从网上盗来的一张图：![Alt text](../img/defer_and_async.jpg)

蓝色线代表网络读取（加载脚本），红色线代表执行脚本；绿色线代表`HTML`解析

​	从上图可以得出以下几点：

​	1.`defer`和`async`在网络读取这一点上是一样的，都是异步进行的；

​	2.两者差别在于脚本加载完后何时执行，很明显`defer`更接近我们对于应用脚本加载和执行的要求（更接近把脚本放在`body`底部的情况）；

​	3.关于`defer`，此图未尽之处在于它是按照加载顺序执行脚本的，这一点要善加利用；

​	4.`async`是一个乱序执行的主，因为对于`async`来说，脚本的加载和执行时紧挨着的，所以不管脚本声明的顺序如何，只要加载完了，就立即执行；

​	5.这么说来，`async`对于应用脚本的用处不大，因为它完全不考虑依赖（哪怕是最低级的顺序执行），不过它对于那些可以不依赖任何脚本或不被任何脚本依赖的脚本来说非常合适，比如：Google Analytics。

​	[这篇文章](https://webkit.org/blog/1395/running-scripts-in-webkit/)总结了`defer`和`async`的相同点和区别：

>Both `async` and `defer` scripts begin to download immediately without pausing the parser and both support an optional onload handler to address the common need to perform initialization which depends on the script. The difference between `async` and `defer` centers around when the script is executed. Each `async` script executes at the first opportunity after it is finished downloading and before the window’s load event. This means it’s possible (and likely) that `async` scripts are not executed in the order in which they occur in the page. The `defer` scripts, on the other hand, are guaranteed to be executed in the order they occur in the page. That execution starts after parsing is completely finished, but before the document’s `DOMContentLoaded` event.




