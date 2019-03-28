### JS的执行上下文和执行堆栈

翻译自：http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/

##### 什么是执行上下文

js中代码执行所处的环境大致可以分为以下三种：

 * 全局环境
 * 函数-----运行函数中代码时
 * eval环境-----运行eval内部的文本时

我们把代码执行时所处的环境叫做__执行上下文__。下面的示例中包含了全局上下文和函数（或者说局部）上下文。

![执行上下文](../img/201903272047.jpg)

上面图片中，紫色框起来的是全局上下文，绿色/蓝色和橙色框起来的是函数上下文。全局上下文只有一个，而且可以随时在其他上下文中获取到全局上下文。

函数上下文可以有多个，每个函数在运行时也都会创建一个新的上下文，这个上下文会新建一个私有作用域，在这个作用域内声明的变量及函数外部作用域无法获取。上面的图片中，每个函数内部都可以获取其所处外部上下文中的变量，但从外部上下文中却不能获取到内部上下文中声明的变量或者函数。

##### 执行堆栈

js的解释器是单线程的，也就是说同一时间只有一个任务能被执行，其他动作或者事件需要在一个叫做__执行堆栈__的地方排队等待。下面是一个单线程堆栈示意图：

![单线程堆栈示意图](../img/201903272110.jpg)

当浏览器初次加载脚本时，全局上下文就会被推入到执行堆栈中。如果在全局上下文中执行某一个函数，那么代码的执行就会进入到函数中去并创建一个执行上下文，而且这个执行上下文会被推入到栈顶。

如果你在当前这个函数内部又执行了另外一个函数，那么相同的事情还会发生一次（创建上下文，推入执行堆栈）。浏览器总是会执行处于栈顶的执行上下文。当当前上下文中的代码运行完毕后，该上下文就会退栈，执行控制权就会回到下一层执行上下文中。下面一个示例展示了一个递归函数运行时的执行堆栈

```javascript
(function foo(i){
    if(i === 3){
        return;
    } else {
        foo(++i)
    }
}(0))
```

函数`foo`会调用自己3次，每次变量`i`都会加1。每次`foo`被调用时，一个新的执行上下文就会被创建，当当前上下文执行完毕后就会退栈并把代码执行权归还到下一层执行上下文，直到全局上下文。

![](../img/201903281519.gif)

关于执行上下文有5点需要特别注意：

* 单线程
* 同步执行
* 全局上下文只有一个
* 可以有多个函数上下文
* 函数调用会产生新的执行上下文，即使是递归调用自己。



#####  执行上下文的细节

执行上下文的调用分成两个阶段：

* __创建阶段（在函数被调用但还没有执行内部代码之前）__：
  * 创建作用域链
  * 创建变量，方法和参数
  * 给`this`赋值
* __代码执行阶段__
  * 给变量赋值，执行代码

我们用个对象来表示执行上下文：

```javascript
executionContextObj = {
    'scopeChain': {/*variableObject + all parent execution context's variableObject*/},
    'variableObject': {/*function arguments/ parameters,, inner variable and function declartions*/},
    'this': {}
}
```

##### Activation / Variable Object[AO / VO]

在函数被调用但还没有执行前上面这样的一个执行上下文就会被创建。这属于第一阶段，创建阶段。在这一阶段，解释器通过扫描函数入参，函数内容声明的局部变量来创建`executionContextObj`，而扫描的结果则会构成`executionContextObj`的`variableObject`属性。

下面解释器执行代码的大致过程：

1.代码触发函数

2.在执行函数代码前，创建执行上下文`execution context`

3.进入创建阶段：

* 初始化作用域链`scope chain`;
* 创建`variable object`
  * 创建`argument object`，检查入参上下文，初始化变量名和变量值，创建引用拷贝
  * 扫描上下文中的函数声明：
    * 对每一个函数声明，在`variable object`上创建一个同名属性，并将该属性指向内存中该函数位置
    * 如果与函数同名的属性已经存在，则属性值会被新的函数指针所覆盖
  * 扫描上下文中的变量声明：
    * 对每一个变量，在`variable object`上创建一个同名属性，并将该属性值初始化为`undefined`
    * 如果`variable object`上已经存在一个同名属性，则跳过该变量不做任何操作
  * 给`this`赋值

4.执行阶段

* 执行处于上下文中的代码，给变量赋值

看个例子：

```javascript
function foo(i){
    var a = 'hello';
    var b = function privateB(){};
    
    function c(){}
}

foo(22);
```

调用`foo(22)`时，解释器在上下文创建阶段会创建出大致如下的上下文对象：

```javascript
fooExecutionContext = {
    scopeChain: {...},
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c(),
        a: undefined,
        b: undefined
    },
    this: {...}
}
```

在创建阶段，除了方法的参数之外，其他变量会被定义但不会被赋值。创建阶段结束后，上下文进入执行阶段，执行阶段结束后会上下文对象大致会变成下面这个样子：

```javascript
fooExecutionContext = {
    scopeChain: {...},
    variableObject:{
        arguments:{
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c(),
        a: 'hello',
        b: pointer to function privateB()
    },
    this: {...}
}
```

##### 变量提升

变量和方法的声明会被提升到当前作用域的头部，这个可以用上面的知识来解释。

```javascript
(function(){
    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined
    
    var foo = 'hello',
    	bar = function(){
            return 'world';
    	}
    
    function foo(){
        return 'hello';
    }
}());
```

问题一：为什么在变量声明前我们就能获取它？

回答：在创建阶段，变量就已经被声明，所以在执行阶段能获取到变量。当上面的代码进入到执行阶段时，`foo`方法就已经`activation object`中定义了。

问题二：`foo`声明了两次，为什么最后`foo`为一个函数而不是`undefined`或者`string`?

回答：在创建阶段，我们直到函数会先于变量在`activation object`上创建同名属性，而且对于变量来讲，当`activation object`上已经存在同名属性时，解释器会跳过不做任何操作。因此，回到上面的代码中，一个指向方法`function foo()`的属性会首先被创建到`activation object`上，当解释器运行到`var foo`这行代码时，由于在`activation object`上已经存在同名属性了，所以解释器不会做任何操作。

问题三：为什么bar打印出来是`undefined`？

`bar`只是一个赋值为函数的变量，变量在创建阶段被创建并被初始化为`undefined`，所以会输出为`undefined`。

##### 总结

希望你对js代码的执行有了一定的了解。理解执行上下文和执行堆栈会让你对代码的运行有更深的理解。