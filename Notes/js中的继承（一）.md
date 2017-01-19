​	在`ES6`之前，`Javascript`的面向对象的实现不像`Java`那样通过`class`关键字来实现，它没有类的概念，它的继承则通过__原型__来实现。

​	`Javascript`中每个函数都可以作为构造函数来通过`new`操作符调用，调用后的结果就是返回一个以这个函数为构造函数的实例对象。

```javascript
var Book = function(id, bookname, price){
  	this.id = id;
  	this.bookname = bookname;
  	this.price = price;
}
Book.prototype.display = function(){
  	console.log(this.bookname);
}
var book = new Book("10", "js设计模式", "20");
book.display();//"js设计模式"
```

​	关于通过`this`和通过`prototype`添加属性和方法的区别这里先不说了。

​	以下一段话引用自《`Javascript`设计模式与开发实践》（P18）：

> `Javascript`遵守的原型编程的基本规则:
>
> * 所有数据都是对象
> * 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
> * 对象会记住它的原型
> * 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型



先说几个基本的知识：

> 1、每个构造函数都有一个原型对象（`prototype`），原型对象都包含一个指向构造函数的指针；
>
> 2、每个对象都有一个`__proto__`属性，该属性指向该对象的原型，或者说是其构造函数的`prototype`属性；
>
> 3、每个对象都有一个`constructor`属性，正常情况下指向对象的构造函数，但是这个属性可以手动更改，所以不正常情况下就未必指向对象的构造函数了；
>
> 4、上面第三条换一种说法就是：每一个对象（实例）都有一个`constructor`属性，默认调用其构造函数的`prototype`对象的`constructor`属性。