### 组合式继承

将类式继承和原型继承的有点结合起来，就是__组合式继承__。

类式继承是子类的原型为父类的实例，构造函数继承是将父类构造函数放在子类环境中进行执行，将以上两种方式结合起来就是组合继承。

```javascript
function SuperClass (name){
  	this.name = name;
  	this.books = ["Javascript", "html", "css"];
}
SuperClass.prototype.getName = function(){
  	console.log(this.name);
}

//子类
function SubClass (name, time){
  	//构造函数继承
  	SuperClass.call(this, name);
  	//子类中新增共有属性
  	this.time = time;
}
//类式继承 子类原型继承父类
SubClass.prototype = new SuperClass();
//子类原型方法
SubClass.prototype.getTime = function(){
  	console.log(this.time);
}
```

如上所示，在子类构造函数中执行父类构造函数，在子类原型上实例化父类就是组合式继承，这种方式融合了类式继承和构造函数继承的优点，并过滤掉了缺点。

```javascript
var instance1 = new SubClass("js book", 2014);
instance1.books.push("设计模式");
console.log(instance1.books);//["Javascript", "html", "css", "设计模式"]
instance1.getName();// "js book"
instance1.getTime();// 2014

var instance1 = new SubClass("css book", 2013);
console.log(instance1.books);//["Javascript", "html", "css"]
instance1.getName();// "css book"
instance1.getTime();// 2013
```

如上面代码所示，子类实例中更改父类继承下来的引用类型属性如`books`，根本不会影响到其他实例，并且子类实例化过程中又能将参数传递到父类的构造函数中，如`name`。

这种组合模式的缺点是，在子类构造函数中执行了一遍父类的构造函数，实现子类原型的类式继承时又调用了一遍父类的构造函数，也就是说，在一次实例化的过程中父类构造函数调用了两遍，所以，这种方式并不完美。