控制台先输出0，然后每隔1s输出1 -> 2 -> 3 -> 4 -> 5:

```javascript
const tasks = [];
for (var i = 0; i < 5; i++){
  ((j) => {
    tasks.push(new Promise((resolve) => {
      setTimeout(() => {
        console.log(new Date, i);
        resolve();//改变Promise状态，使其从pending => resolve
      }, 1000 * j);
    }));
  })(i);
}

Promise.all(tasks).then(() => {
  setTimeout(() => {
    console.log(new Date, i);
  }, 1000);
})
```

使用了：声明即执行函数、const、箭头函数、Promise

Promise的几个优点：

1、将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数；

2、Promise对象提供统一的接口，使得异步操作更加容易。

缺点：

1、无法取消Promise，__一旦建立它就会立即执行__，无法中途取消；

2、如果不设置回调函数，Promise内部抛出的错误，不会反应到外部；

3、当处于Pending状态时，无法得知目前进展到哪一个阶段。

```javascript
var promise = new Promise(function (resolve, reject) {
  //... some code
  if(/*异步操作成功*/){
    resolve(value);
  } else {
    reject(error);
  }
})
```

Promise构造函数接收一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们为两个函数，由Js引擎提供。

`resolve`函数作用是，将`Promise`对象从“未完成“变成”成功”（Pending=>Resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将Promise对象的状态从“未完成”变为“失败”（Pending=>Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成后，可以使用then方法指定`Resolved`和`Rejected`状态的回调函数。

```
promise.then(function (value){
  //success
}, function (error) {
  //failure
})
```

then方法接受两个回调函数最为参数。第一个为Promise变为Resolved时调用，第二个为Promise变为Rejected时调用。其中，第二个函数可选。两个函数都接受Promise对象传出的值。

```javascript
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, "done");
  });
}
timeout(100).then((value) => {
  console.log(value);
})
//done
```

