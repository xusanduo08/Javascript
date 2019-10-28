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











