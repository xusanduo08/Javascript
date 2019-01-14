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


// 上面是之前写的了，不知道当时为什么这么写？感觉下面这么写也可以实现啊，还更简洁。
for(let i = 0; i < 6; i++){
    new Promise(resolve => {
        setTimeout(() => {
            console.log(i);
            resolve();
        }, i*1000)
    })
}
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

```javascript
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



##### Promise的错误处理

调用`resolve`或者`reject`并不会终结Promise的参数函数的执行。

```javascript
new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
}).then(r => {
    console.log(r)
})
```

上面代码在调用`resolve(1)`之后，后面的`console.log(2)`还是会执行，并且会首先打印出来。这是因为立即resolved的Promise是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。



`then()`方法的第二个参数用来作为promise被`reject`时（也包括运行出错时）的回调函数。

promise运行出错或者reject时可以在两个地方处理错误，一个是在`then()`方法里定义reject时的回调函数，即第二个参数；一个是在调用链尾部添加`catch`方法。

```javascript
new Promise(resolve => {
    throw new Error()
}).then(res => {
	console.log(res)
}, err => {
    console.log(err) // 会打印出错误堆栈
})
```

以上的写法和下面这个效果类似

```javascript
new Promise(resolve => {
    throw new Error(0)
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err);
})
```

Promise对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是被下一个`catch`语句捕获。

```javascript
getJson('/post/1.json').then(post => getJson(post.commentURL))
	.then(comments => {
        // do something
	}).catch(error => {
        // 处理前三个Promise产生的错误
	})
```

上面的三个Promise对象：一个由getJson产生，两个由then产生，它们之中任何一个抛出错误，都会被最后一个`catch`捕获。

一般来说，不要在`then`方法里面定义reject状态的回调函数，总是使用`catch`方法。

Promise会吃掉错误。

##### 使用`Promise.all()`编排多个promise

如果有多个异步请求需要发起，所有需求完成后又需要基于每个请求的返回值做些其他事情，这种情况下就可以采用`promise.all()`来完成。

```javascript
const f1 = fetch('./something.json');
const f2 = fetch('./something2.json'); // fetch方法返回的也是promise实例

Promise.all([f1, f2])
	.then(res => {
        console.log('Array of results', res);
	})
	.catch(err => {
        console.log(err);
	})
```

使用es6中数组的解构赋值后可以采用如下写法：

```javascript
Promise.all([f1, f2]).then(([res1, res2]) => {
    console.log('Results', res1, res2);
})
```



##### 使用`Promise.race()`来编排多个promise

如果多个promise之间是竞态关系，其中有一个promise完成后就基于当前完成的promise的返回值执行后续动作，并且剩下的再有promise完成也不再执行后续动作，这种情况可以采用`Promise.race()`来实现。

```javascript
const promiseOne = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one');
})

const promiseTwo = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'two');
})

Promise.race([promiseOne, promiseTwo]).then(result => {
    console.log(result); // two
})
```





