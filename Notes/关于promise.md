#### 关于promise

```javascript
let def = {};
def.promise1 = new Promise(resolve => {
	def.resolve1 = resolve;
})
def.promise2 = new Promise(resolve => {
	def.resolve2 = resolve;
})

def.promise2.then(actual => console.log(acutla));
def.promise1.resolve('promise1'); // promise1状态此时为fulfilled
def.promise2.resolve(def.promise1); // promise1作为参数传入promise2的resolve方法中，promise2的then方法的第一个参数即为promise1.resolve出来的结果
```

上面代码打印出来的是'promise1'。

resolve一个已经完成的promise，则then方法的第一个参数为已完成的promise的结果