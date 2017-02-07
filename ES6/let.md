`let`和`var`类似，但是`let`所声明的变量只能在`let`命令所在代码块内有效。

```javascript
{
  let a = 10;
  var b = 1;
}
a;//Uncaught ReferenceError: a is not defined
b;//1
```

上面代码在代码块中，分别用`let`和`var`声明了两个变量。然后在代码块之外调用这两个变量，结果`let`声明的变量报错，`var`声明的变量返回了正确的值。这说明，`let`声明的变量只在它所在的代码块有效。

```javascript
var a = [];
for(var i = 0; i < 10; i++){
  	a[i] = function(){
      console.log(i);
  	};
}
a[6]();//10
```

上面代码中，变量`i`是`var`声明的，在全局范围内都有效。所以每一次循环，新的`i`值都会覆盖旧值，导致最后输出的是最后一轮的`i`的值。

```javascript
var a = [];
for(let i = 0; i < 10; i++){
  	a[i] = function(){
      console.log(i);
  	};
}
a[6]();//6
```

上面代码中，变量`i`是`let`声明的，当前的`i`只在本轮循环有效，所以每一次循环的`i`其实都是一个新的变量，所以最后输出的是6。因为`Javascript`引擎内部会记住上一轮循环的值，初始化本轮的变量`i`时，就在上一轮循环的基础上进行计算。

### 变量提升

__`let`声明的变量不存在变量提升问题。__`var`声明的变量会发生变量提升现象，即变量可以在声明之前使用，值为`undefined`。按照一般的逻辑，变量应该在声明语句之后才可以使用。`let`命令改变了语法行为，它所声明的变量一定要在声明后使用，否在报错。

```javascript
//var的情况
console.log(foo);//undefined
var foo = 2;

//let的情况
console.log(bar);//Uncaught ReferenceError: bar is not defined
let bar = 2;
```

### 暂时性死区

只要块级作用域内存在`let`命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```javascript
var tmp = 123;

if(true){
 	tmp = "abc";//Uncaught ReferenceError: tmp is not defined
    let tmp;
}
```

上面代码中，存在全局变量`tmp`，但是块级作用域内`let`又声明了一个全局变量`tmp`，导致后者绑定这个块级作用域，所以在`let`声明变量前对这个`tmp`赋值会报错。

ES6明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量从一开始就形成了封闭的作用域。凡是在声明之前就使用这些变量，就会报错。

### 不允许重复声明

`let`不允许在相同作用域内重复声明同一个变量。

```javascript
//报错Uncaught SyntaxError: Identifier 'a' has already been declared
function foo(){
  	let a = 10;
  	var a = 1;
}

//报错 Uncaught SyntaxError: Identifier 'a' has already been declared
function fun(){
  	let a = 10;
  	let a = 1;
}
```

因此，不能在函数内部重新声明参数。

```javascript
function func(arg){
  	let arg;//报错 Uncaught SyntaxError: Identifier 'arg' has already been declared
}
function func(arg){
  	{
      	let arg;//不报错
  	}
}
```

