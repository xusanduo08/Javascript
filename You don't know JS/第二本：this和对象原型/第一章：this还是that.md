## 你不知道的JS：`this`和对象原型

## 第一章：`this`还是that？

JavaScript中的`this`关键字可以说是最令人迷惑的机制之一了。这个关键字很特殊，它会随着函数作用域的创建而被自动定义，但这个关键字真正的指向即使对于有经验的开发者来说有时候也难以判断。

> 所有先进的技术都和魔法无异。----Arthur C.Clarke

`this`机制并不是什么先进的技术，但大家总是认为`this`很复杂、很难以理解，其根本原因还是缺乏关于`this`的清晰的认知。

**注意：**“this”是沟通中常用的一个代词。所以，特别是在口头交流中，判断“this”是做代词用还是做一个关键字标识符用是相当困难的。简单起见，我会用`this`表示当前字符指向的是关键字，而“this”或者 this 表示其他含义。

### 为什么要用`this`？

如果`this`机制对于有经验的开发者来说依然是难以理解的，那为什么还说它很有用呢？它带来的麻烦比好处多么？在介绍`this`如何发挥作用之前，先来介绍下为什么`this`如此受重用。

我们通过下面的代码展示下使用`this`的动机以及`this`的功能：

```javascript
function identify(){
  return this.name.toUpperCase();
}

function speak(){
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}
var me = {
  name: "Kyle"
}
var you = {
  name: 'Reader'
}

identify.call(me); // KYLE
identify.call(you); // READER

speak.call(me); // Hello, I'm KYLE
speak.call(you); // Hello, I'm READER
```

如果你觉得这段代码有些难以理解，别担心，稍后我们会进行讲解。先把疑问丢到一遍，下面我们探究“为什么”。

上面代码中的`identify()`和`speak()` 可以在多个上下文对象中运行（`me`和`you`），而不用针对每个对象单独写一个函数。

如果不使用`this`，你需要将上下文对象显式的传递给`identify()`和`speak()`：

```javascript
function identify(context){
  return context.name.toUpperCase();
}
function speak(context){
  var greeting = "Hello, I'm " + identify(context);
  console.log(greeting);
}
identify(you); // READER
speak(me); // Hello, I'm KYLE
```

`this`提供了一种更优雅的隐式传递对象引用的方式，因此可以将API设计的更加简洁并且复用性更好。

你的应用越复杂，你就越能发觉显式的传递上下文比使用`this`传递上下文麻烦的多。当我们在研究对象和原型时，你会发现，一组能够自动指向正确上下文对象的函数是多么的有用。

### 困惑

在介绍`this`的原理之前，先来看关于`this`的几种误用。

过分的从字面上理解"this"会带来困惑。关于“this”的一般有两种理解，但很抱歉，这两种都是错误的。

#### 自身

第一种理解是`this`为指向函数自身的引用。从语法上看，这种理解似乎有些道理。

为什么要从函数内部指向函数本身呢？比较可能的场景是递归（在函数内部调用自身）或者是事件处理函数在第一次调用时返回解绑函数。

一些JS的新手觉得，将函数当作对象（JavaScript中函数也是对象）用能够在函数调用的同时存储状态（作为属性值存储），这种做法当然是可以的，并且也有一些用处。本书的后面部分会介绍其他更佳适用于存储状态的方法。

目前，我们就先来研究下将函数当作对象用这种模式，研究下把`this`当成是指向函数自身的引用这种想法哪里错了。

看下面的代码，在代码中，我们尝试记录函数（`foo`）的运行次数：

```javascript
function foo(num){
  console.log('foo: ' + num);
  // keep track of how many times `foo` is called
  this.count++;
}

foo.count = 0;
var i;
for(i = 0; i < 10; i++){
  if(i > 5){
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log(foo.count); // 0 --WTF?
```

尽管`foo(...)`内部的`console.log()`的四次输出证明了`foo(...)`确实被调用过了四次，但`foo.count`的值依然是`0`。显然，从字面理解`this`的含义这种做法是错误的。

`foo.count = 0`这段代码在执行时确实给`foo`这个函数对象增加了一个`count`属性。但在函数内部，`this.count`中的`this`却不是指向函数对象的，所以，虽然属性名是一样的，但由于访问的根对象不一样，因此得到的结果也不一样。

**注意**：对于一个好学的开发者来说，此时会有个问题：“如果我当前操作的不是我期望对象的`count`属性，那这个`count`属性是谁的？”。事实上，深挖下去就会发现，我们实际上创建了一个全局变量`count`（具体原因请看第二章），而且操作结束后这个变量的值是`NaN`。当然，到这里我们还可以继续问：“为什么会创建一个全局变量？这个变量的值又为什么会是`NaN`而不是期望的值？”。（请看第二章）

遇到这些复杂但重要的问题后，大多数开发者都选择回避，然后选择其他方法，比如创建另一个对象，并在这个新建的对象上增加一个`count`属性来满足需求：

```javascript
function foo(num){
  console.log('foo: ' + num);
  // keep track of how many times `foo` is called
  data.count++;
}

var data = {
  count: 0
}

var i;
for(i = 0; i < 10; i++){
  if(i > 5){
    foo(i);
  }
}

// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log(data.count); // 4
```

这种方法使用了我们更熟悉的词法作用域的一些机制满足了需求，但没有真正解决问题----`this`到底是什么以及它是如何工作的。

**注意：**虽然词法作用域是个很强大很好用的工具（可以查看本系列的“作用域和闭包”），但我们依然要去学习和理解`this`的机制和原理，不能在对`this`感到迷惑或者不理解时总是回头去使用词法作用域。

`this`是无法胜任在函数内部获取指向函数引用这一“使命”的。你可以通过一个指向函数的词法标识符来获取函数的引用。

看下面的代码：

```javascript
function foo(){
  foo.count = 4; // `foo` refers to itself
}
setTimeout(function(){
  // anonymous function (no name), cannot
  // refer to itself
}, 10);
```

第一个函数是个“具名“函数，在函数内部可以通过`foo`来获取指向自身的引用。

但是在第二段代码中，传入`setTimeout(...)`的回调函数是个匿名的回调函数，也因此，在这个匿名函数内部并没有合适的方法来指向函数自身。

**注意：**函数内部的`argument.callee`引用可以指向当前正在执行的函数对象，但这个属性已经被废弃了，尽管这是在匿名函数内部指向函数自身的唯一方法。其实，最好的方法就是不要使用匿名函数，而是使用具名函数，至少对于那些需要引用自身的函数来说是这样的。

所以，对于一开始的例子来说，另一个解决方法就是使用`foo`标识符来指向函数对象，而不是使用`this`：

```javascript
function foo(num){
  console.log('foo: ' + num);
  // keep track of how many times `foo` is called
  foo.count++;
}
foo.count = 0;
var i;
for(i = 0; i < 10; i++){
  if(i >5){
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called
console.log(foo.count); // 4
```

但是，这种方法还是没有直面对`this`的理解，本质上还是依赖了`foo`这个变量的词法作用域。

还有种方法是强制`this`指向`foo`函数：

```javascript
function foo(num){
  console.log('foo: ' + num);
  
  // keep track of how many times `foo` is called
  // Note: `this` IS actually `foo` now, based on
  // how `foo` is called(see below)
  this.count++;
}
foo.count = 0;
var i;
for(i = 0; i < 10; i++){
  if(i > 5){
    // using `call(...)`, we ensure the `this`
    // points at the function object (`foo`) itself
    foo.call(foo, i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log(foo.count); // 4
```

**这次我们没有回避`this`，并且还使用了它**。别担心，稍微我们会对这种方法进行讲解。

#### 自身的作用域

另一种误解就是将`this`理解为指向函数作用域的引用。这种理解有些“打擦边球”，因为在某些情况下，这种理解是正确的，而对于一些其他情况这种理解又完全不正确。

先明确一点，`this`并不指向函数的词法作用域。从本质上说，作用域像是一个对象，它的属性就是各个变量标识符，并且我们可以访问到这些标识符。但是，这个对象是引擎的一个内部实现，我们是无法在代码中访问到它的。

下面的代码试图（没有成功）跨越边界，使用`this`隐式的引用函数的词法作用域。

```javascript
function foo(){
  var a = 2;
  this.bar();
}
function bar(){
  console.log(this.a);
}
foo(); // undefined
```

这段代码中有多个错误。虽然像是故意这么写的，但实际这段代码是从社区中互帮互助论坛摘取出来的，它完美的展示了对`this`的臆想有多么的误导人。

首先，代码中试图通过`this.bar()`来获取`bar()`函数的引用。虽然这段代码能工作，但只能说这是一个意外，后面我们会讲解为什么。正常情况下，省略掉`this`，直接使用词法标识符就能够调用`bar()`方法。

这段代码的作者试图通过`this`在`foo()`和`bar()`的词法作用域之间的架一座桥梁，这样`bar()`就可以访问到`foo()`内部的变量`a`。但是，**这座桥梁并不存在**。你不能通过`this`去引用词法作用域中的内容，这是不可能的。

每当你要尝试将`this`和词法作用域查询混合在一起时，你就要告诉自己：这是不可能的。

### `this`是什么？

上面介绍了几种对`this`的错误理解，现在我们来讲解下`this`的工作机制。

我们开头说过，`this`是一个运行时绑定而不是编写时绑定，它依赖于函数被调用时的条件。`this`绑定和函数声明的位置无关，但和函数被调用的方式有关。

当函数被调用时，一个活动记录或者说一个执行上下文会被创建。这个上下文记录着函数的调用堆栈，函数被调用的方式，函数的参数等等。`this`就是这个上下文的一个属性引用，并且在函数的运行过程中可以使用这个`this`。

下一章，我们会学习如何查找函数的调用位置，从而判断函数在运行时是如何和`this`绑定的。

### 小结

对于那些没有花时间去理解`this`的人来说，`this`绑定一直是一件令人困惑的事情。猜测，试错，或者盲目的从Stack Overflow中复制粘贴答案并不能让你加深对`this`这一重要机制的理解。

学习`this`，首先要知道哪些不是`this`，尽管这些臆想或者误解曾经误导过你。`this`不是函数自身的引用，也不是函数词法作用域的引用。

`this`是函数在被调用时发生的绑定，它的指向完全取决的函数的调用位置。