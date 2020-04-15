> 类式继承说的是子类的原型是父类的实例，这种继承有两个缺点，第一，如果父类中有引用类型的属性，那么就会被所有子类共用，一个子类更改其从父类中继承的引用类型属性就会直接影响其他子类

```
//声明父类
function SuperClass(){
  	this.superValue = true;
  	this.books = ["Javascript", "html", "css"];
}
//声明子类
function SubClass(){
  	this.subVlaue = false;
}
SubClass.prototype = new SuperClass();
var instance1 = new SubClass();
var instance2 = new SubClass();
console.log(instance2.books);//["Javascript", "html", "css"]
instance1.books.push("设计模式");
console.log(instance2.books);//["Javascript", "html", "css", "设计模式"]

```

> 第二个缺点：由于子类继承靠的是其原型`prototype`对父类实例化实现的，所以，在创建父类的时候，无法向父类传递参数，因而在实例化父类的时候也就无法对父类构造函数内的属性进行初始化。

### 构造函数继承

```javascript
/**构造函数继承**/

//声明父类
function SuperClass (id){
	//引用类型共有属性
  	this.books = ["Javascript", "html", "css"];
  	//基本类型共有属性
  	this.id = id
}
//父类声明原型方法
SuperClass.prototype.showBooks = function(){
  	console.log(this.books);
}

//声明子类
function SubClass (id){
	//继承父类
	SuperClass.call(this, id);
}

var instance1 = new SubClass(10);
var instance2 = new SubClass(11);

instance1.books.push("设计模式");
console.log(instance1.books);//["Javascript", "html", "css", "设计模式"]
console.log(instance1.id);//10
console.log(instance2.books);//["Javascript", "html", "css"]
console.log(instance2.id);//11

instance1.showBooks();// Uncaught TypeError: instance1.showBooks is not a function

```

构造函数的重点就在于`SuperClass.call(this, id);`这一句。使用`call`改变了父类中`this`的指向，指向了正在创建中的子类，所以这一句就是将父类的构造函数在子类的环境中执行一遍。由于父类构造函数是给`this`绑定属性，所以这地方也就相当于给子类绑定属性，从而也就实现了子类继承父类构造函数中的属性和方法。

由于构造函数继承没有涉及原型`prototype`，所以父类原型中的属性和方法不会被子类继承，父类的属性和方法要想被子类继承必须放到构造函数中，但这样创建出来的每个实例都会单独拥有一份属性和方法，而不能共用，违背了代码复用的原则。将类式继承/原型链继承和构造函数继承的优点结合起来，就有了__组合式继承__。