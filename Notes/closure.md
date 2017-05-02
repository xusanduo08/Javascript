__闭包__（closure）是一个受到保护的变量空间，由内嵌函数生成。`Javascript`具有函数级作用域。这意味着定义在函数内部的变量在函数外部不能被访问。`Javascript`的作用域又是词法性质（lexically scoped）的。这意味着函数运行在定义它的作用域中，而不是调用它的作用域中。把这两个因素结合起来，就能通过把变量包裹在匿名函数中的方法而对其加以保护。可以这样创建类的私有变量：

```javascript
var baz;
(function() {
  var foo = 10;
  var bar = 2;
  baz = function(){
    return foo * bar;
  };
})();
baz();//及时bar()运行在匿名函数外面，它也能获取匿名函数内部的变量bar和foo
```

变量`foo`和`bar`定义在匿名函数中。因为函数`baz`定义在这个闭包中，所以它能访问这两个变量，即使在该闭包执行结束以后。