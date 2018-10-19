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
import muFunc from './lib.js
```



其中，A即为该模块对外的接口。export还有下面几种形式：

```javascript
export let a = 1;
export function b(){};
/***********或者******************/
let a = 1;
function b(){}
export {a, b};
```

上面两种形式在其他文件中导入时，均需要一下写法：

```javascript
import { a , b } from 'xxx'
```

