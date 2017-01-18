```javascript
var fn = function(){};
fn.prototype;	//Object{}
fn.prototype.constructor;	//function (){}
fn.constructor;		//function Function() { [native code] }
```



先说几个基本的知识：

​	1、每个构造函数都有一个原型对象（`prototype`），原型对象都包含一个指向构造函数的指针；

​	2、每个对象都有一个`__proto__`属性，该属性指向该对象的原型，或者说是其构造函数的`prototype`属性；

​	3、每个对象都有一个`constructor`属性，正常情况下指向对象的构造函数，但是这个属性可以手动更改，所以不正常情况下就未必指向对象的构造函数了；

​	4、上面第三条换一种说法就是：每一个对象（实例）都有一个`constructor`属性，默认调用其构造函数的`prototype`对象的`constructor`属性。

首先，函数在`js`中也是一个对象，函数对象由`Function`构造而来，所以`fn.constructor`才是`Function(){}`。再有，`fn`还可以作为构造函数使用，在作为构造函数使用时拥有`prototype`属性，而这个`prototype`是一个对象，所以`fn.prototype`是一个`Object`。最后，`javascript`规范中说，构造函数都有一个`prototype`属性，这个`prototype`指向一个对象，而这个对象具有一个`constructor`属性，这个属性指向构造函数自身。