### const命令

`const`声明一个只读的常量。一旦声明，常量的值就不能改变。

```javascript
const PI=3.1415926;
PI;//3.1415926

PI=3.14;//Uncaught TypeError: Assignment to constant variable.
```

上面代码表示对一个`const`声明的常量重新赋值会报错。

`const`声明的变量不得改变值，意味着，`const`一旦声明变量，就必须立即初始化，不能留到以后赋值。

```javascript
const foo;//Uncaught SyntaxError: Missing initializer in const declaration
```

上面代码表示，对于`const`来说，只声明不赋值，就会报错。

`const`的作用域与`let`命令相同：只在声明所在的块级作用域内有效。

```javascript
if(true){
  	const MAX = 5;
}
Max;//Uncaught ReferenceError: Max is not defined
```

`const`命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。

```javascript
if(true){
  	console.log(MAX);//Uncaught ReferenceError: MAX is not defined
  	const MAX = 5;
}
```

上面代码在常量`MAX`声明之前就调用，结果报错。

`const`声明的常量，与`let`一样，不可重复声明。

```javascript
var message = "Hello";
let age = 25;

const message = "Goodbye!";//Uncaught SyntaxError: Identifier 'message' has already been declared
const age = 30;//Uncaught SyntaxError: Identifier 'age' has already been declared
```

对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。`const`命令只是保证变量指向的地址不变，并不保证改地址的数据不变，所以将一个对象声明为一个常量必须非常小心。

```javascript
const foo = {};
foo.prop = 123;
foo.proop;//123

foo = {};//Uncaught TypeError: Assignment to constant variable.
```

上面代码中，常量`foo`存储的是一个地址，这个地址指向一个对象。不可变的只是这个地址，既不能把`foo`指向另一个地址，但是对象本身可变，所以依然可以为其添加新属性。

看另一个例子：

```javascript
const a = [];
a.push("Hello");//可执行
a.length = 0;//可执行
a = ["Dave"];//报错Uncaught TypeError: Assignment to constant variable.
```

上面代码中，常量`a`是一个数组，这个数组本身可写，但是如果将另一个数组赋值给`a`即让`a`存储另一个地址，就会报错。

