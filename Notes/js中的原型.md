```javascript
var fn = function(){};
fn.prototype;	//Object{}
fn.prototype.constructor;	//function (){}
fn.constructor;		//function Function() { [native code] }
```

首先，函数在`js`中也是一个对象，函数对象由`Function`构造而来，所以`fn.constructor`才是`Function(){}`。再有，`fn`还可以作为构造函数使用，在作为构造函数使用时拥有`prototype`属性，而这个`prototype`是一个对象，所以`fn.prototype`是一个`Object`。最后，`javascript`规范中说，构造函数都有一个`prototype`属性，这个`prototype`指向一个对象，而这个对象具有一个`constructor`属性，这个属性指向构造函数自身。