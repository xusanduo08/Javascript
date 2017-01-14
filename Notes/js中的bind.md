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

```
if(!Function.prototype.bind){
  	Function.prototype.bind = function(oThis){
      	if(typeof this !== "function"){
          	throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
      	}
      	var aArgs = Array.prototype.slice.call(arguments, 1),
          	fToBind = this,
          	fNOP = function(){},
          	fBound = function(){
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
```

