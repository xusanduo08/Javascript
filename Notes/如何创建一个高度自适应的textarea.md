### 如何创建一个高度自适应的textarea

这个内容源自SF的一个[问题](https://segmentfault.com/q/1010000000095238)。

在网上搜到的对于上面的问题的答案如下：

```javascript
$('textarea').keyup(function () {
  $(this).height(this.scrollHeight);
})
```

上面的代码确实可以实现textarea自适应的效果，但是有下面的问题：上面采用的是keyup事件，因此在页面上存在延迟。视觉效果就是，先出现一个滚动条，然后等按键抬起时文本框再被拉长，滚动条消失，体验较差。针对这个问题，把keyup事件改成input事件即可。测试了下，同样的代码，采用input事件，在Chrome、Safari、IE11、Firefox都能达到文本框自适应的效果。

关于scrollHeight还有很多其他用处，可以查看[这里](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight)。

另外，再提供一种创建高度自适应的方法，源自[这里](https://alistapart.com/article/expanding-text-areas-made-elegant)。

HTML结构如下：

```html
<div class="expandingArea ">
    <pre><span></span><br></pre>
    <textarea placeholder="输入文字"></textarea>
</div>
```

样式如下：

```css
.expandingArea{
    position:relative;
}
textarea{
    position:absolute;
    top:0;
    left:0；
    height:100%;
  	resize: none;
}
pre{
    display:block;
    visibility:hidden;
}
```

这个结构和样式下实现高度自适应textarea的思路如下：

textarea相对于expandingArea绝对定位，而且样式里设置了textarea的高度始终等于expandingArea的高度，所以要让textarrea高度变化也只需要调整expandingArea的高度即可。pre标签起到的就是让expandingArea高度变化的作用。因为pre以块形式存在，虽然不可见但是能占据空间。这个时候只要把textarea中的内容实时的同步到pre标签的span标签中，因为pre没有定位，expandingarea也没有设置高度和`overflow：hidden`，所以pre高度会将expandingArea高度撑起来。

一句话总结就是：pre会随内容的高度变化而变化，expandingArea的高度又随pre变化。因为textarea的高度100%，所以textarea高度会随expandingArea高度变化，只要同步textarea的内容到pre中，就能达到textarea随内容高度变化的目的了。

对应的js脚本如下：

```javascript
var TxDOM = document.getElementsByTagName("textarea")[0];
var spanDOM = document.getElementsByTagName("span")[0];
TxDOM.addEventListener("input", function () { /*这里使用的是input事件*/
  spanDOM.innerHTML = this.value;
})
```

以上可以达到自适应textarea的效果。在Chrom、Safari、Firefox下没有兼容性问题；在IE11下输入框右侧会出现滚动条，可以给textarea加样式`overflow:hidden`即可。