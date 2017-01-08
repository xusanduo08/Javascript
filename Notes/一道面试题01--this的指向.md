直接上题目：

```
var length = 10;
function fn(){
  console.log(this.length);
};
var obj = {
  length: 5,
  method: function (fn){
    fn();
    arguments[0]();
    fn.call(obj, 12);
  }
};
obj.method(fn, 1);
```

乍一看，题目很简单，答案应该是 `10 10 5`，可是，正确答案应该是`10 2 5`。下面来分析一下：

js中主要有四种this绑定的类型，分别如下：

​	1、默认绑定

​	2、隐式绑定

​	3、显示绑定

​	4、new绑定

1、默认绑定：在什么都匹配不到的情况下，非严格模式`this`绑定到全局对象或者`global`，严格模式绑定到`undefined`；

2、隐式绑定：方法作为对象的属性调用时，方法体中的this绑定到对象身上；

3、显示绑定：通过`call`或者`apply`调用的方法，其内部的`this`绑定为`call`或`apply`的第一个参数；

4、`new`绑定：在创建对象过程中，`new`会使得构造函数以及原型链中的方法内部的`this`绑定到当前正在创建的对象身上。

回到题目身上，`obj.method(fn, 1)`运行之后，函数内部首先运行`fn()`，很明显，这个时候直接调用`fn`那么`fn`内部的`this`就绑定到了`window`身上（或者理解成由`window`调用`fn`），所以答案是10；接下来，`arguments[0]()`，`arguments`在js中属于类数组对象，具有`length`属性，但不具有数组的一些方法，很明显，`arguments[0]()`运行的就是`fn()`，那这个地方是由谁调用`fn`的呢？答案是由`arguments`来调用，这里`fn`作为`arguments`的内部的一部分，由`arguments`调用，所以此时`fn`内部的`this`就指向了`arguments`，而这一步中的`arguments`的`length`属性值为2，所以答案是2；最后一问，使用了`call`来将`fn`中的`this`显示绑定到`obj`身上，所以，答案就是`obj`的`length`属性，结果为5。