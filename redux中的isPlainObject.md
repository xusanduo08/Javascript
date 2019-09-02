#### redux中的isPlainObject

redux中`isPlainObject()`用来判断一个对象是不是普通对象，关于plain object并没有官方定义，redux中为满足下列条件的对象：

* 通过对象字面量创建，比如：

```javascript
let a = {name: 'xxx', age: 32}
```

* 通过`new Object()`创建的对象，并且中间没有其他继承

```javascript
let a = new Object();
```



redux中`isPlainObject()`代码如下：

```javascript
export default function isPlainObject(obj){
  if(typeof obj !== 'object' || obj === null) return false
  
  let proto = obj;
  while(Obejct.getPrototypeOf(proto) !== null){
    proto = Object.getPrototypeOf(proto);
  }
  return proto === Object.getPrototypeOf(obj);
}
```

先通过`typeof`操作符过滤参数不是对象类型和`null`的情况。

所有对象最顶层的原型都是`Object.prototype`。如果`obj`中间有继承发生，那么第一层原型和最后一层原型必然不想等。

所以，通过循环获取最顶层原型链，如果最顶层原型和第一层原型相等，则说明中间没有其他继承，又由于都等于`Object.prototype`，所以可以判断传入的参数是一个 plain object.

##### 为什么不直接使用`return Object.getPrototypeOf(obj)===Object.prototype`来判断而要使用一个循环呢？

答：考虑一些跨域（cross-realm）的情况。主页面为A，A中通过iframe引入子页面B

A.html中有如下脚本：

```javascript
window.onload = function(){
  let action = window.frames[0].window.action;
  console.log(Object.getPrototypeOf(action) === Object.prototype); //false
  console.log(isPlainObject(action)); // true
}

function isPlainObject(obj){
  if(typeof obj !== 'object' || obj === null) return false;
    
  let proto = obj;
  while(Object.getPrototypeOf(proto) !== null){
    proto = Object.getPrototypeOf(proto);
  }
  return proto === Object.getPrototypeOf(obj);
}
```

B.html中有如下变量：

```javascript
 window.action = {type:'ADD', payload:{text:'add'}}
```

A中脚本在控制台输出的两个值分别为`false  true`。

直观感觉第一个输出值也应该为`true`才对，但实际并没有。原因在于，A和B中的脚本分别属于两个执行环境，这两个执行环境不会共享`Object.prototype`，A中的`Object.prototype`和B中的`Object.prototype`并不相等，所以最终输出的就是`false`。

综上，直接根据`Object.getPrototypeOf(obj) === Object.protoype`返回值判断一个值的原型是否为`Object.prototype`并不靠谱。

测试代码地址：https://github.com/xusanduo08/Javascript/tree/master/Notes/code/plain-object

##### 现在还能使用Object.prototype.toString.call(obj)判断obj是否为对象么？

看下面代码：

```javascript
var a = {};
Object.prototype.toString.call(a); // [object Object]
a[Symbol.toStringTag] = 'Custom';
Object.prototype.toString.call(a); // [object Custom]
```

所以使用`Object.prototype.toString.call()`判断一个变量是否为对象严格来说也不靠谱了。