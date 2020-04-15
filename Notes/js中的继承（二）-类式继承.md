重复一下四条基本规则：

>`Javascript`遵守的原型编程的基本规则:
>
>- 所有数据都是对象
>- 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
>- 对象会记住它的原型
>- 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

### 类式继承/原型链继承

```javascript
//声明父类
function SuperClass(){
  	this.superValue = true;
}
//为父类添加共有方法
SuperClass.prototype.getSuperValue = function(){
  	return this.superValue
}

//声明子类
function SubClass(){
  	this.subVlaue = false;
}

//继承父类，将父类的实例赋给子类的原型
SubClass.prototype = new SuperClass();

//为子类添加共有方法
Subclass.prototype.getSubValue = function(){
  	return this.subValue;
}

var instance = new SubbClass();
console.log(instance.getSuperValue());//true
console.log(instance.getSubValue());//false
```

其实类式继承说白就是：子类的原型指向的是父类的实例，或者`SubClass.prototype instanceof SuperClass == true `

实例对象`instance`的原型链：

```
instance.__proto__ =>Subclass.prototype;
Subclass.prototype.__proto__ =>SuperClass.prototype;
SuperClass.prototype.__proto__ => Object.prototype;
Object.prototype.__proto__ => null
//所以有
instance.__proto__.__proto__ =>SuperClass.prototype;
instance.__proto__.__proto__.__proto__=>Object.prototype;
instance.__proto__.__proto__.__proto__.__proto__ = null;
```

上面展示的就是对象`instance`的原型链，通过原型链来一层层寻找属性和方法，找到即止，找不到则返回`undefined`