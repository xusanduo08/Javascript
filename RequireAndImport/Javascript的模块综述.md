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
* 比较难进行代码解析

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

在Node.js的模块顶层有一些抽象和CommonJS的还是很类似的。

在Node.js和CommonJS中都是用require和exports来导入和导出模块。require用来导入其他块到当前的模块中，require方法的参数为要导入的模块的id。在NodeJS中，node_modules目录下的模块用require来导入，模块名即为入参（如果是其他目录下的则传入路径）。exports是一个比较特殊的对象，其上的任何属性都被作为公开属性而被导出，而exports所在模块的作用域依然被保留。