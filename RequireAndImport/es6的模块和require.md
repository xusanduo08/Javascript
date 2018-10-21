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

##### import导入进来的是对其他模块的引用(注意，是引用)，是只读的

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

//The imported value can't be changed
couter++；//报错，TypeError
```

类似于`import x from 'foo'`这种导入方式生成的变量x，其效果其实和使用`const`命令声明一个x差不多，声明后都是不可以修改的；同理，如果导入的是一个对象，比如`import * as foo from 'foo'`，这个时候对象foo就是一个[frozen object](http://speakingjs.com/es5/ch17.html#freezing_objects).

当使用星号（*）导入一个模块时，同样需要遵守上面的规定：

```javascript
//main2.js
import * as lib from './lib'

//The imported value 'counter' is live
console.log(lib.counter);//3
lib.incCount();
console.log(lib.counter);//4

//The imported value can't be changed
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

##### 模块的循环加载

CommonJS对循环加载的处理：

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

对于上面的代码，假设a.js先执行，此时，因为首行导入了b模块，所以执行引擎转而去加载b模块，因为CommonJS中在第一次引入一个模块时会执行这个模块，这时候在执行b模块时发现b又导入了a，而此时，a模块并没有exports任何东西，所以此时在b模块中a变量是个空对象{}，也因此在bar函数中，a.foo不是个可运行的函数。

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

当main.js在加载a.js时，因为a.js引入了b.js，所以执行引擎会去加载b.js，在去加载b.js之前，a模块已经有了一个输出属性`exports.done=false`。b.js又引入a模块，此时，为了避免陷入无限循环，__b只会导入a中已经执行并且输出的变量__，也就是`{done: false}`，所以在b.js的 i 行会输出`in b, a.done = false`。然后，执行引擎继续执行b.js剩下的代码，最终b.js执行完后对外导出的是`{done: true}`。执行引擎回到a.js中，a.js中导入的完整的b的输出对象为`{done: true}`，然后接着执行a.js剩下的代码。

最终执行main.js的输出日志如下：

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

这地方要注意的就是，__一旦出现某个模块被循环加载，就只输出已经执行的部分，还未执行的部分不会输出__。使用CommonJS规范导入的模块是对导出模块的复制（意思是导入之后，被导入模块内部再有某些导出内容发生变化不会体现到导入该内容的其他模块中），并且只有在第一次加载时会去运行要加载的模块，然后会缓存导入的值，之后再有导入则直接从缓存中读取