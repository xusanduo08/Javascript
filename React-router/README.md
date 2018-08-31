###浏览器的history API

可以实现改变浏览器地址而不刷新浏览器

```javascript
window.history.pushState(null, null, '/name');//或者直接用history.pushState也行
```

浏览器的历史记录可以看成一个堆栈 ----先进后出，最上层的记录就是当前正在展示的页面的相关信息。调用`pushState`方法就是往这个堆栈上增加记录。

调用`pushState`之后，会往浏览器的历史记录中添加一条新记录，同时改变地址栏的地址内容。方法接收三个参数：

1.对象或者字符串，用于描述新记录的一些特性。这个参数会被一并添加到历史记录中，以供以后使用。

2.一个字符串，代表新页面的标题。当前基本上所有浏览器都会忽略这个参数。

3.一个字符串，代表新页面的相对地址。

用户点击浏览器的前进、后退按钮时，就会触发`popstate`事件。可以监听这个事件，从而做出反应。

```javascript
window.addEventListener('popstate', function(e){
  console.log(e.state);//这个e.state就是pushState中的第一个参数
 
})
```

如果不是添加一条记录，而是替换当前记录，可以使用`replaceState`方法，也就是替换掉当前浏览器正在显示的那个页面的记录，其参数和`pushState`一样。



#### location.reload(boolean)//刷新页面

#### location.replace(url)//替换当前浏览器的最新一条记录，和replaceState方法效果一样。

#### 

```
history.pushState(null, null, 'http://www.baidu.com')//这样写会报错，好像只允许相对地址
location.assign('wwww');//要区分相对地址和绝对地址，新增记录
location.href=url;//url要区分绝对地址和相对地址，新增记录。
```

