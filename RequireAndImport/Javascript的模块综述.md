#### JS的模块

##### 介绍：为什么Javascript需要模块

​	如果你熟悉其他一些编程语言，你可能会对__封装__和__依赖__有一些概念。正常情况在开发一个软件时，通常会把这个软件根据功能细分成不同模块来分别开发，最后再根据需要将这些小模块组装起来



##### 揭示模式

​	在目前常用的一些模块系统被使用之前，揭示模式一直流行于javascript编码中。揭示模式是在模块模式上的改进，它能返回定义和获取一个私有作用域内变量的方法。

```javascript
var myRevealingModule = (function () {
    var privateVar = "Ben Cherry",
        publicVar = "Hey there!";

    function privateFunction() {
        console.log( "Name:" + privateVar );
    }

    function publicSetName( strName ) {
        privateVar = strName;
    }

    function publicGetName() {
        privateFunction();
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        setName: publicSetName,
        greeting: publicVar,
        getName: publicGetName
    };
})();

myRevealingModule.setName( "Paul Kinlan" );
```

​	javascript的作用域在es6之前都是通过函数区分的。也就是说，定义在函数内部的变量在函数外部是无法获取到的。揭示模式的实现也是依赖于js的函数级作用域。

在上面代码中，公共方法都已经暴露出来，其他的一些变量作为保护都被包裹在函数级作用域内部。这种模式比较好的封装了代码，但是关于依赖并没有涉及到。对于一个完整的模块系统来讲，依赖肯定是要有的。

优点：

* 容易实现
* 每个模块都可以单独封装在一个文件中

缺点：

* 无法动态导入模块
* 依赖需要人工处理
* 无法异步加载模块
* 循环加载可能会需要额外的处理
* 无法静态解析

##### CommonJS

`CommonJS`本意是定义一系列规范以协议服务端`javascript`的开发。`CommonJS`设计到的其中一想规范就是模块化。`Node.js`的开发者起初在设计`Node.js`的模块时遵循的就是`CommonJS`的规范，但后来决定放弃该规范。但是目前`Node.js`中的模块依然和`CommonJS`所规范的很相像。

```javascript
// In circle.js
const PI = Math.PI;

exports.area = (r) => PI * r * r;

exports.circumference = (r) => 2 * PI * r;

// In some file
const circle = require('./circle.js');
console.log( `The area of a circle of radius 4 is ${circle.area(4)}`);
```

>One evening at Joyent, when I mentioned being a bit frustrated some ludicrous request for a feature that I knew to be a terrible idea, he said to me, "Forget CommonJS. It's dead. We are server side JavaScript." - [NPM creator Isaac Z. Schlueter quoting Node.js creator Ryan Dahl](https://github.com/nodejs/node-v0.x-archive/issues/5132#issuecomment-15432598)

在`Node.js`的模块顶层有一些抽象和`CommonJS`的还是很类似的。

在`Node.js`和`CommonJS`中都是用`require`和`exports`来导入和导出模块。`require`用来导入其他模块到当前的模块中，`require`方法的参数为要导入的模块的`id`。在`NodeJS`中，`node_modules`目录下的模块用`require`来导入，模块名即为入参（如果是其他目录下的则传入路径）。`exports`是一个比较特殊的对象，其上的任何属性都被作为公开属性而被导出，而`exports`所在模块作用域内的其他东西依然被隐藏在作用域内部。`Node.js`和`CommonJS`在模块的实现上的一个比较突出的不同在于module.exports上。在Node中，真正用来导出数据的是`module.exports`对象，而`exports`只不过是`module.exports`的一个引用。但是在`CommonJS`中，则不存在`module.exports`对象。在Node中如果不使用`module.exports`则无法导出模块：

```javascript
// 对exports的直接赋值导致exports与module.exports失去联系
// 这将是的无法将这个匿名函数导出这个模块
exports =  (width) => {
  return {
    area: () => width * width
  };
}

// 最终导出的还是module.exports对象。
module.exports = (width) => {
  return {
    area: () => width * width
  };
}
```

`CommonJS`的模块一开始就是为了服务端而设计的，所以它的一些API都是同步的。换句话说，模块是按照它们在文件中出现的顺序来导入的。

> "`CommonJS` modules were designed with server development in mind."
>
> TWEET THIS ![img](https://cdn.auth0.com/blog/resources/twitter.svg)

优点：

* 简单：开发者可以很直接的使用导出导出命令而不用去看文档
* 依赖管理完整：模块之间可以相互依赖，模块会按照在文件中出现的顺序按序加载
* `require`命令可以根据条件使用：可以在条件语句中使用require命令
* 支持循环加载

缺点：

* 同步加载没法使用在客户端
* 模块的划分以文件为单位
* 如果在浏览器端使用的话还需要转义
* 模块没有构造函数
* 无法静态解析

##### 异步模块加载-----`AMD`

`AMD`支持异步加载，这是`AMD`和`CommonJS`最大的不同。

> "The main difference between `AMD` and `CommonJS` lies in its support for asynchronous module loading."
>
> TWEET THIS ![img](https://cdn.auth0.com/blog/resources/twitter.svg)

```javascript
//define方法定义一个模块，第一个参数为数组，其中放置该模块依赖的其他模块
define(['dep1', 'dep2'], function (dep1, dep2) {

    //返回该模块对外暴露的值
    return function () {};
});

// 如果没有依赖其他模块，直接一个函数就可以构造一个模块
define(function (require) {
    var dep1 = require('dep1'),
        dep2 = require('dep2');

    return function () {};
});   
```

这其中异步加载模块的实现依赖于`javascript`中的闭包：模块加载完成后调用另一个函数。模块的定义和对其他依赖模块的导入在一个函数中完成：当模块定义完成后，它的依赖也会有所明确。所以说在运行时，`AMD`加载器能够获取到项目完整的依赖。而相互之间没有依赖关系的模块，可以同时被加载。这对浏览器来说非常重要，毕竟页面在短时间内加载完毕能获取一个非常好的用户体验。

优点：

* 异步加载，不阻塞页面的渲染
* 支持循环加载
* 兼容`require`和`exports`
* 能够很好的管理依赖
* 模块可以分布在多个文件中
* 有构造函数
* 支持插件（实现自定义加载顺序）

缺点：

* 语法上有些复杂
* 无法直接使用，需要编译或者其他工具库协助
* 对静态代码解析器来说比较难进行解析

##### `es6`的模块

`es6`的模块兼容了异步和同步两种模式。

```javascript
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}

//------ main.js ------
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

`import`命令用来导入其他模块至当前模块中。此外，与`require`和`define`命令相比，`import`不支持动态导入（只能置于模块头部）。`export`命令用来导出当前模块的内容。

`import`和`export`的静态特性使得代码解析器可以在代码没有运行时就能获取到模块间完整的依赖关系。`es6`的模块不支持动态加载，但目前已经有提案要求增加这一功能：

```javascript
System.import('some_module')
      .then(some_module => {
          // Use some_module
      })
      .catch(error => {
          // ...
      });
```

优点：

* 同步加载和异步加载都支持
* 语法上比较简单
* 支持静态解析
* `javascript`本身就支持，无序额外的兼容库
* 支持循环加载

缺点：

* 无法动态导入





参考：

* https://auth0.com/blog/javascript-module-systems-showdown/