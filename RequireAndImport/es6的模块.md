#### es6的模块

​	es6的模块导入导出命令式`import`和`export`，而`require`是CommonJS规范下的模块导入方法，其对应的模块导出方法是使用`module.exports`。

​	在当前webpack和babel的帮助下，`import`和`export`，`require`和`module.exports`都可以在浏览器端使用。

##### 基本用法

* `export/import`：`export`用于将一个模块的内容导出，import则用于将一个模块的内容导入，写法：

有两种导出方式：named exports和default exports

named exports：在一个变量的声明表达式前加上关键字export即可将该变量导出，此时该变量的名称即为变量与外界的接口。

```javascript
//lib.js
export const a = 3;
export function square(x){
    return x * x;
}
const b = {a: 3}
export { b }
//main.js
import { a, square, b } from './lib.js'
console.log(a);//3
console.log(b);//{a:3}
console.log(square(11));//121
```

可以使用`as`关键字来改变模块对外界的接口：

```javascript
//lib.js
const a = 3;
function square(x){
    return x * x;
}
const b = {a: 3}
export { b as B, square as Squ, a as A }
```

这样上面文件对外界的接口分别就是B，Squ，A，导入的时候就要导入这几个接口：

```javascript
import { B, Squ, A};
import { b };
console.log(b);//undefined
```

导入时的接口名要和导出时的接口名称一致，否则无法导入成功。

default exports：每个模块都可以设置一个默认导出值，使用 `export default xxx`语法导出。

```javascript
//lib.js
export default function(){}

//main.js
import myunc from './lib.js';// import { default as myFunc } from './lib.js'
import youFunc from './lib.js';// import { default as youFunc } from './lib.js'
import hisFunc from './lib.js';//
// myFunc, youFunc, hisFunc代表的内容都一样
```

`export default xxx`其实就是`export { xxx as default}`的一种简写形式。

在使用import导入默认模块时，import后面跟着的变量名可以任意指定。原因在于，在导入默认模块时`import xxx from './lib.js'`其实就是`import { default as xxx} from './lib.js'`的简写。

还有很多基本用法这里就不说了，具体可以参考[这里](http://exploringjs.com/es6/ch_modules.html#sec_modules-in-javascript)，或者[这里](http://es6.ruanyifeng.com/#docs/module)



##### import的使用必须放在当前文件的顶部,不能在条件语句和代码块中导入导出模块

不能将import和export放在代码块和条件语句中使用：

```javascript
if(xxx){
    import 'foo' from 'xxx';
    //或者
    export default foo;
}

{
    import 'foo' from 'xx'
    //或者
    export default foo
}
//以上都是错误写法
```



##### import具有提升效果，会提升到整个模块顶部，首先执行。

```javascript
foo();
import { foo } from 'xxx';
```

上面的代码不会报错，因为`import`的执行早于`foo`的调用执行。__这种行为的本质是，`import`是编译阶段执行的命令，在代码运行之前。__



##### import导入进来的是对其他模块的只读引用(注意，是引用)

`import`导入进来的是通过`export`导出来的模块的只读引用，当`export`所导出的内容在自身所在文件被修改了之后，已经导入这个内容的其他模块是能获取到这个最新的变化的。

```javascript
//lib.js
export let counter = 3;
export function incCounter(){
    counter++;
}

//main.js
import { counter, incCounter } from './lib.js'
//The imported value 'counter' is live
console.log(counter);//3
incCounter();
console.log(counter);//4

//The imported value can't be changed
couter++；//报错，TypeError
```

类似于`import x from 'foo'`这种导入方式生成的变量`x`，其效果其实和使用`const`命令声明一个`x`差不多，声明后都是不可以修改的；同理，如果导入的是一个对象，比如`import * as foo from 'foo'`，这个时候对象`foo`就是一个[frozen object](http://speakingjs.com/es5/ch17.html#freezing_objects)。

当使用星号（*）导入一个模块时，同样需要遵守上面的规定：

```javascript
//main2.js
import * as lib from './lib'

//The imported value 'counter' is live
console.log(lib.counter);//3
lib.incCount();
console.log(lib.counter);//4

//The imported value can't be changed，导入值是不能直接修改的
lib.counter++;//TypeError
```

有一点需要注意，我们不能改变导入进来的变量的值，但是对于引用类型变量，我们可以添加一些属性：

```javascript
//lib.js
export let obj = {};

//main.js
import { obj } from './lib';

obj.prop = 123;//可以这样操作，不会报错
obj = {};//报错，这改变了obj指向的内存地址，不允许
```



上面是`es6`的`module`具有的特性，对于`CommonJS`规范下的模块来说，`require`命令导入进来的是模块的拷贝，导入的值一旦导入完成就会被缓存，与原模块就不存在关系了，原模块有变化发生也不会影响到已经导入的值（除非清理缓存）。所以，`CommonJS`规范下导入模块所挂载的变量是可以随意修改的。

```javascript
//a.js
var b = require('./b');
console.log(b.bar());// bar
b = 3;
console.log(b);// 3

//b.js
exports.bar = function(){
	console.log('bar');
};
```

`a.js`中导入`b`模块，并将导入的值挂载在了变量`b`下，此时`a`模块中的变量`b`只是`b`模块的拷贝，`b`模块中再有任何变化都不会影响到`b`，同时，`b`的值可以任意修改。

##### 模块的循环加载

__`CommonJS`对循环加载的处理__：

```javascript
//a.js
var b = require('./b');
function foo(){
    b.bar();
}
exports.foo = foo;

//b.js
var a = require('./a');
function bar(){
    if(Math.random()){
       a.foo();
    }
}
bar();//TypeError:a.foo is not a function
exports.bar = bar;
```

对于上面的代码，假设`a.js`先执行，此时，因为首行导入了b模块，所以执行引擎转而去加载b模块，因为CommonJS中在第一次引入一个模块时会执行这个模块，这时候在执行b模块时发现b又导入了a，而此时，a模块并没有exports任何东西，所以此时在b模块中a变量是个空对象`{}`，也因此在`bar`方法中，`a.foo`不是个可运行的函数。

再看下nodeJS官网给出的例子：

```javascript
//a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');

//b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);//i
exports.done = true;
console.log('b done');

//main.js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

当`main.js`在加载`a.js`时，因为`a.js`引入了`b.js`，所以执行引擎会去加载`b.js`，在去加载`b.js`之前，a模块已经有了一个输出属性`exports.done=false`。`b.js`又引入a模块，此时，为了避免陷入无限循环，__b只会导入a中已经执行并且输出的变量__，也就是`{done: false}`，所以在`b.js`的 i 行会输出`in b, a.done = false`。然后，执行引擎继续执行`b.js`剩下的代码，最终`b.js`执行完后对外导出的是`{done: true}`。执行引擎回到`a.js`中，a.js中导入的完整的b的输出对象为`{done: true}`，然后接着执行`a.js`剩下的代码。

最终执行`main.js`的输出日志如下：

```
main starting
a starting
b starting
in b, a.done = false
b.done
in a, b.done = true
a.done
in main, a.done=true, b.done=true
```

这地方要注意的就是，__一旦出现某个模块被循环加载，就只输出已经执行的部分，还未执行的部分不会输出__。使用CommonJS规范导入的是对导出模块值的__复制__（意思是导出一个值之后，模块内部发生其他变化是不会影响到这个值的），并且只有在第一次加载时会去运行要加载的模块，然后导入的值会被缓存，之后再有导入则直接从缓存中读取。



__es6 module对循环加载的处理__：

es6支持循环加载，因为es6导入的是对模块的引用，只要在使用的时候确保这些引用能够取到值就可以。看代码：

```javascript
//a.js
import {bar} from 'b'; // i
console.log(bar);
export let foo = 'foo';

//b.js
import { foo } from 'a';
console.log(foo); // ii
export let bar = 'bar';
```

上面代码中，引擎执行`a.js`，发现导入了`b.js`，所以接下来去执行`b.js`。`b.js`中从`a.js`导入了接口`foo`，这时候不会去执行`a.js`，而是认为这个接口已经存在了，继续往下执行，在试图打印输出`foo`时才发现这个接口还没定义，然后报错。解决方法是当`b.js`中准备打印`foo`时让`foo`在`a.js`中有定义：

```javascript
//a.js
import {bar} from 'b'; // i
console.log(bar);
function foo(){
    return 'foo'
}
export {foo};

//b.js
import { foo } from 'a';
console.log(foo()); // ii
export let bar = 'bar';
```

这样在运行a.js时，控制台就会打印出理想结果：

```
foo
bar
```

当运行到`b.js`中ii行时，因为`foo`是指向`a.js`内部变量的一个引用，所以引擎就会去调用这个引用所指向的方法，而此时在`a.js`中，虽然`foo`方法还没有导出，但由于__函数声明式__的提升作用，`foo`已经有定义了，所以此时运行`foo()`不会报错。

##### webpack对模块的支持

目前webpack4自带支持`es6`、`CommonJS`和`AMD`模块功能，可以在不使用任何插件或者loader的情况下使用webpack编译上述几种模块。

##### webpack是如何处理各种模块的

webpack是一个打包工具，它的功能是识别出`import`和`export`等命令，并加载对应的模块。也就是说，webpack并不是把`import`和`export`换成另一种表述让浏览器去加载这些模块，而是根据代码中已经写好的`import`和`export`把相关的模块加载好并合并成一个文件然后让浏览器去加载并运行这个文件。

我们来看`es6`里的模块被webpack编译后编程什么样了：

```javascript
//a.js
let A = {
    a: "A"
}
export {A as a}; 

//index.js
import { default as  A } from './es6'
console.log(A)
```

打包后的文件如下：

```javascript
//编译后的内容为一个自执行函数，入参为一个对象，对象属性为各个模块的路径+文件名，属性值即为各模块的内容
(function (modules) { // webpackBootstrap
  var installedModules = {}; // 缓存加载的模块
  
  //用来加载模块的方法
  function __webpack_require__(moduleId) {
    // 检查模块是否已经缓存（是否已经加载过）
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 没有缓存的话创建一个模块，模块id即为要加载的模块的id，模块的exports属性用来挂载模块导出的内容，属性名为模块对外接口名
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // 运行模块id对应的模块函数加载模块
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 标识当前模块为已经加载
    module.l = true;

    // 返回module.exports
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  // 定义获取模块的getter方法，模块内容就通过getter返回
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // 定义Object.prototype.hasOwnProperty.call方法
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // 加载并返回入口模块
  return __webpack_require__(__webpack_require__.s = "./index.js");
})
  ({
    "./es6.js":
      (function (module, __webpack_exports__, __webpack_require__) { //__webpack__exports即为上面临时创建的module，其exports属性用来装载导出的内容
        "use strict";
        __webpack_require__.r(__webpack_exports__); // 给模块打上 _esModule=true 属性
        //定义getter方法，方法返回模块导出的内容，即对象A，
        //而且由于在模块中导出内容是挂在接口a下的，所以getter方法为__webpack__exports__的a属性的方法
        // 即  __webpack__exports__.a为模块导出的内容
        __webpack_require__.d(__webpack_exports__, "a", function () { return A; });
        let A = { a: "A" }
      }),
    "./index.js":
      (function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
       	// 加载es6.js模块
        var _es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./es6.js");
        //打印es6.js模块的内容，注意这地方打印的是a属性，这个a是es6.js模块对外的接口，如果es6.js使用export default 导出模块，那么这地方的a属性就会变成default属性
        console.log(_es6__WEBPACK_IMPORTED_MODULE_0__["a"]);
      })
  });
```

可以看出：

* webpack把各模块的内容作为属性值挂载在了以各模块所在文件路径为属性名的属性下面，且这些属性都放在`installedModules`这一对象下。
* 只有在第一次加载这个模块的时候回去运行这个模块，之后的加载都会到`installedModules`对象下去取对应的模块内容。
* 很明显可以看出上面`index.js`所加载的只是`es6.js`模块的引用，`es6.js`中对象`A`有任何变化都可以在`index.js`中获取到。
* es6模块用的是严格模式-----`use strict`

webpack对`require`的处理后面再补充，有一点要特别注意，如果使用`require`加载`export default`导出的模块，webpack不会自动解析`default`属性到对应的变量上。

```javascript
//a.js
let a = 1;
export default a;

//index.js
let requireA = require('./a.js');
let importA = import ('./a.js');
console.log(requireA);// {default: 1}
console.log(importA);// 1
```

这个时候需要在webpack中使用一个插件`babel-plugin-add-module-exports`，这样在代码中使用`require`导入`export default`的内容就不需要手动去获取`default`属性内容了。

先写这么多