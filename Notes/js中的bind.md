### bind()

​	众所周知，`call`和`apply`能够显式的指明一个方法中`this`的指向，那假如，某一个方法需要频繁调用，而且其中的`this`总是指向同一个对象，这时候每次都写`fun.call()`或者`fun.apply()`是不是有点太烦了----所以，在这种情况下就可以使用`bind`了。

​	首先要明白，`bind`返回的是一个__新的函数__，这个新的函数中`this`已经指明方向，如果再使用`call`或者`apply`来企图改变其中的`this`指向，是没有效果的，看例子：

```javascript
var obj_01 = {
  	name: "dasheng",
  	age: 26
}
var obj_02 = {
  	name: "fansheng",
  	age: 27
}
var getName = function(){
  	console.log(this.name)
}
var getName_01 = getName.bind(obj_01);//bind返回一个新的函数，这个函数中this始终指向obj_01
getName_01();//"dasheng"
getName_01.call(obj_02);//"dasheng"，打印结果依然是obj_01的name属性值
```

​	`bind()`方法的第一个参数为要绑定的`this`指向，剩下的参数为预先传入函数中的参数，修改一下上面的例子：

```javascript
var obj_01 = {
  	name: "dasheng",
  	age: 26
}

var getName = function(age,work){
  	console.log(this.name+ " " + age + " " + work)
}
var getName_01 = getName.bind(obj_01,obj_01.age);//将obj_01的age属性值预先传入方法中
//调用的时候只需要传入剩下需要的参数即可
getName_01("程序员");//dasheng 26 程序员
```

​	下面看一下`bind`如何在旧浏览器中做兼容：

```javascript
//摘自MDN
if(!Function.prototype.bind){
  	Function.prototype.bind = function(oThis){
      	if(typeof this !== "function"){
          	throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
      	}
      	var aArgs = Array.prototype.slice.call(arguments, 1),
        	fToBind = this,
        	fNOP = function(){};
        	
        	//最终要返回的函数
        var fBound = function(){
              return fToBind.apply(this instanceof fNOP
              							? this
              							:oThis || this,
              							aArgs.concat(Array.prototype.slice.call(arguments)));
          	};
      	fNOP.prototype = this.prototype;
      	fBound.prototype = new fNOP();
      	
      	return fBound;
  	}
}
//简单版,基本功能都有
if(Function.prototype.bind === undefined){
  	Function.prototype.bind = function(obj){
      	var fun = this;
      	var args = Array.prototype.slice.call(arguments, 1);
      	return function(){
          	var innerArgs = Array.prototype.slice.call(arguments);
          	var allArgs = args.concat(innerArgs);
          	fun.apply(obj, allArgs);
      	}
  	}
}
```

两种版本里都用到了`Array.prototype.slice.call()`，这种方法非常普遍的用来将类数组转成数组，看下它的源码实现：

```javascript
Array.prototype.slice = function(starti, endi){
  	var sub = [];
  	for(var i = starti; i < endi; i++){
      	sub.push(this[i]);
  	}
  	return sub;
}
/*
	Array.prototype.slice.call(arguments)说白了，将slice()方法内部的this指向arguments，然后将arguments中的元素一个一个拿出来，放到一个数组中，然后返回这个数组，这就完成了将类数组到数组的转变
*/
```

### bind()的一些用法

​	在默认情况下，使用`window.setTimeout()`时，`this`关键字会指向`window`（或全局）对象。当使用类的方法时，要`this`引用类的实例，这时候可能需要显式的把`this`绑定到回调函数以便继续使用实例。

```javascript
function LateBloomer(){
 	this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

LateBloomer.prototype.bloom = function(){
	/*
		因为setTimeout()由window调用，所以这地方就将declare中this绑定为当前对象，如果不提前绑定，
		等执行到declare方法时，其内部的this将指向window
	*/
 	window.setTimeout(this.declare.bind(this), 1000);
}

LateBloomer.prototype.declare = function(){
	console.log(this);
  	console.log("I am a beautiful flower with" + this.petalCount + "petals!");
}

var flower = new LateBloomer();
flower.bloom();//一秒钟之后调用declare方法
```

另外`bind()`还有一个常见的用法：有时候会将对象的某个方法拿出来单独使用，同时又希望方法中的`this`指向原来的对象，这种情况下就需要使用`bind()`来实现。

```javascript
this.x = 9;
var module = {
 	x: 81,
 	getX: function(){
      	return this.x;
 	}
}

module.getX();//返回81

var retrieveX = module.getX;
retrieveX();//返回9，此时this指向了window（全局对象）

var boundGetX = retrieveX.bind(module);//创建一个新的函数，将this绑定到module
boundGetX();//返回81
```





_另外，还有一些关于bind()创造的函数的原型以及作为构造函数调用的问题，我暂时也不是很懂，不讲了。。。_