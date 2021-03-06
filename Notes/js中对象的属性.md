### JS中对象的属性		   

对象的属性分为数据属性和访问器属性，两者区别如下：

* 数据属性：数据属性是可以直接使用点语法在对象上定义的属性。
* 访问器属性：无法直接在对象上定义，必须使用JS提供的指定的方法才能定义。

特性（attribute）主要用来描述对象属性（property）的各种特征。也就是说，特性不同于属性，特性是专门用来描述属性的。

数据属性有4个描述其行为的特性，如下：

* [[Configurable]]：默认值为true。如果为true，则表示可以更改属性的其他特性且可以删除属性
* [[Enumerable]]：默认值为true。表示for-in循环是否可返回该属性，如果为false，则表示for-in循环不可返回该属性；
* [[Writable]]：默认值为true，表示能够修改属性的值，如果为false，则表示属性值不可修改；
* [[Value]]：默认值为undefined，这个值即为属性的属性值，可以再这个位置读取属性值，也可以在这个位置写入属性值。

访问器属性也有4个描述其行为的特性，如下：

* [[get]]：返回属性值的函数，此函数没有参数，默认undefined。
* [[set]]：设置属性值的函数，它具有一个包含要分配的值得参数，默认undefined。
* [[Enumerable]]：同上。
* [[Configurable]]：同上。


所以，数据属性和访问器属性，两者区别主要在于：数据属性可直接在对象上使用点语法定义，访问器属性只能通过JS提供的`Object.defineProperty()`定义，另外，访问器属性具有[[setter]]和[[getter]]两个特性，无[[writable]]和[[value]]特性。

`Object.defineProperty()`:

```javascript
var person={name:"fansheng", age: 26};
Object.defineProperty(person, "name",{
  	configurable: true,
  	enumerable: false,
  	writable: false,
  	value: "fansheng"
})
for(var  n in person){
  console.log(n);//age; name属性的enumerable被设为false，则使用for...in无法遍历到
}
person.name = "dasheng";
person.name;//fansheng；name属性的writable设为false，表示该属性值不可写
```

如果属性的`configurable`特性设置为`false`，则表示该属性不可被删除，其自身的其他特性也不可修改，并且一旦`configurable`设为`false`，将不可再更改为`true`。

```javascript
Object.defineProperty(person, "age",{
  	configurable: false,
  	enumerable: false,
  	writable: false,
  	value: "fansheng"
})

//尝试重新定义configurable特性
Object.defineProperty(person, "age",{
  	configurable: true //报错：Uncaught TypeError: Cannot redefine property: age
})

```



  

