#### es6的模块和require

​	es6的模块导入导出命令式import和export，而require是CommonJS规范下的模块导入方法，其对应的模块导出方法是使用module.exports

​	在当前webpack和babel的帮助下，import和export，require和module.exports都可以在浏览器端使用。先来看下基本用法。

##### 基本用法

* export/import：export用于将一个模块的内容导出，import则用于将一个模块的内容导入，写法：

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

可以使用as关键字来改变模块对外界的接口：

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

上面的代码不会报错，因为import的执行早于foo的调用执行。__这种行为的本质是，`import`是编译阶段执行的命令，在代码运行之前。__

##### import导入进来的是对其他模块的引用，是只读的

import导入进来的是通过export导出来的模块的只读内容，当export所导出的内容在自身所在文件被修改了之后，已经导入这个模块的其他模块是能获取到这个最新的变化的。

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
```