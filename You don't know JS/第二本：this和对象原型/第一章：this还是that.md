## 你不知道的JS：`this`和对象原型

## 第一章：`this`还是that？

JavaScript中的`this`关键字可以说是最令人迷惑的机制之一了。这个关键字很特殊，每个函数的作用域在创建时都会自动定义这个关键字，但这个关键字真正的指向即使有经验的开发者有时候也难以判断。

> 所有先进的技术都和魔法无异。----Arthur C.Clarke

`this`机制并不是什么先进的技术，但开发者往往自动带入的认为`this`很复杂、很难以理解。当然，假如没有关于`this`的清晰的认知，我们自然会认为它是个魔法。

**注意：**“this”是沟通中常用的的一个代词。所以，特别是在口头交流中，判断“this”是做代词用还是做一个关键字标识符用是相当困难的。简单起见，我会用`this`表示指向的是关键字，而“this”或者 this 表示其他含义。

### 为什么要用`this`？

如果`this`机制对于有经验的开发者来说依然是难以理解的，那么为什么还说它很有用呢？它带来的麻烦比好处多么？在介绍`this`如何发挥作用之前，先来介绍下为什么`this`有用。

下面来展示下`this`的动机和功能：

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

如果你觉得这段代码有些难以理解，别担心，稍微我们会进行讲解。先把疑问丢到一遍，下面我们探究“为什么”。

上面代码中的`identify()`和`speak()` 可以在多个上下文对象中运行，而不用针对每个对象单独写一个函数。

如果不使用`this`，你需要将上下文对象明确的传递给`identify()`和`speak()`：

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

你的应用越复杂，你就越能发觉显式的使用参数传递上下文比使用`this`传递上下文麻烦的多。当我们在研究对象和原型时，你会发现，一组能够自动指向正确上下文对象的函数是多么的有用。

### 困惑

在介绍`this`的工作方式之前，先来看几种`this`的误用。

如果过分的从字面上理解"this"，那带给开发者的只有困惑。关于“this”的常规理解有两种，但很抱歉，这两种都是错误的。

#### Itself

第一种理解是将`this`理解成指向函数自身。从语法上看，这似乎有情可原。

为什么要从函数内部指向函数本身呢？比较可能的场景是递归（在函数内部调用自身）或者是事件处理函数在第一次调用时返回解绑函数。

一些JS的新手觉得，将函数当作对象（JavaScript中函数也是对象）用能够在函数调用的同时存储状态（作为属性值存储），这种做法当然是可以的，但也有一些局限。本书的后面部分会介绍其他更佳适用于存储状态的方法。

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

`foo.count`的值依然是`0`，尽管`foo(...)`内部的`console.log()`通过四次输出证明了`foo(...)`确实被调用过了四次。其实，从字面理解`this`的含义开始，我们就错了。

`foo.count = 0`这段代码在执行时确实给`foo`这个函数对象增加了一个`count`属性。但在函数内部的`this.count`引用中，`this`却不是指向函数对象的，所以，虽然属性名是一样的，但访问的对象不一样，因此得到的结果也不一样。

**注意**：对于一个好学的开发者来说，此时会有个问题：“如果我当前操作的不是我期望的`count`属性，那这个`count`属性是哪里来的？”。事实上，深挖下去就会发现，我们实际上创建了一个全局变量`count`（具体原因请看第二章），而且操作结束后这个变量的值是`NaN`。当然，到这里我们可以会继续问：“为什么会创建一个全局变量？这个变量的值又为什么会是`NaN`而不是期望的值？”。（请看第二章）

遇到这些问题后，大多数开发者都选择回避，然后去创建另一个对象，并在这个新建的对象上增加一个`count`属性来满足需求：

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

这种方法虽然能满足需求，但回避了要讨论的问题----`this`到底是什么以及它是如何工作的，













