### Function和Object在继承上的关系

学习js的时候就没搞清楚js中的继承，特别是`Function(){}`和`Object(){}`两者的关系。

我们知道，`Function(){}`也是一个对象，而且是一个函数对象。在js中函数对象最顶层的构造函数就是`Function(){}`，所以，这里就有一点比较绕，`Function(){}`自己创造了自己。

```javascript
Function.__proto__ === Function.prototype;//true
Function.constructor === Function;//true
```

上面的代码可以说明`Function(){}`自己创造了自己。

另外，`Object(){}`也是一个函数对象，所以也是由`Function(){}`创建的，所以就有下面的关系。

```javascript
Object.__proto__ === Function.prototype;//true
Object.constructor === Function;//true
```

上面代码说明，`Object(){}`这个对象由构造函数`Function(){}`创建。

最后一点，我们知道，所有对象的原型链的顶端都是`Object.prototype`，那么`Function.prototype`的上一层是什么呢？`Function(){}`并不是从其他对象继承来的（我的意思，它和`Object`之间是直接的父子的关系），所以有下面的关系。

```javascript
Function.prototype.__proto__ === Object.prototype;//true
```

好了，把上面的关系捋一下：`Object(){}`由`Function(){}`创建，`Function(){}`自己创建了自己，但是`Function.prototype`又继承自`Object.prototype`。

```javascript
Function.__proto__ === Function.prototype;//true
Object.__proto__ === Function.prototype;//true
Function.prototype.__proto__ === Object.prototype;//true
Object.prototype.__proto__ === null;//true
```

我创造了我自己

我还创造了你

但是，我却离不开你

就这样。