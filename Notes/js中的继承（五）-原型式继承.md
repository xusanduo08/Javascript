> 前面说过，组合式继承在创建实例的时候会调用父构造函数两次，所以并不完美。于是就有了原型继承。

### 原型式继承

《`Javascript`设计模式与开发实践中》提到过：要得到一个对象，不是实例化，而是找到一个对象作为原型并克隆它。原型式继承的原理和这句话差不多：借助原型`prototype`可以根据已有的对象创建一个新的对象，同时不必创建新的自定义对象类型。

看实现代码：

```js
//原型式继承
function inheritObject (o){
  	//过渡对象
  	function F(){};
  	//过渡对象的原型继承父对象
  	F.prototype = 0;
  	//返回一个过渡对象的实例，该实例的原型继承了父对象
  	return new F();
}
```

以上代码和类式继承相似，区别在与在上面的代码中，子类`function F(){}`作为一个过渡类出现，构造函数中无内容，所以执行起来开销比较小。

上面这种继承方式具有和类式继承一样的缺点，即子类对继承自父类构造函数中引用类型属性进行更改后，会影响到其他子类实例。

```javascript
function create(o){
  function A(){}
  A.prototype = o;
  return new A();
}

function Super(grade){
  this.grade = grade;
}
Super.prototype.sayHi = function(){
  console.log('Hi, Super prototype');
}

function Sub(name){
  this.name = name;
}

var o = create(Super.prototype);
o.constructor = Sub;
Sub.prototype = o;

var sub = new Sub('sub class');
```

原型链结构图：

![原型式继承](../img/原型式继承.png)



