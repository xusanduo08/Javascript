`map()`方法会以调用该方法的数组元素为入参挨个去调用一个回调函数，这个回调函数的返回值会构成一个新的数组。调用`map()`方法的那个数组不会被影响。

`map()`方法会传入三个参数到回调函数中：

* currentValue：数组中正在处理的当前元素
* index：数组中正在处理的当前元素的索引
* array：map方法被调用的数组

知道上面这些后来看下面一道题：

```javascript
// 下面这行代码运行后返回什么？
["1", "2", "3"].map(parseInt);
```

大多数都会觉得结果是：

```javascript
[1, 2, 3]
```

但实际结果是：

```javascript
[1, NaN, NaN]
```

`parseInt()`方法是可以接收两个参数的，第一个参数为要被解析的字符串，第二个参数为表示上述字符串的基数。

`map()`方法在调用回调函数时会传递给它三个参数：当前正在遍历的元素，元素的索引，原数组本身。

第三个参数`parseInt`会忽视，但第二个参数不会，也就是说`parseInt`会将传过来的索引值当成进制数来使用，从而返回了`NaN`。

可以做如下改造，使得返回预期值：

```javascript
["1", "2", "3"].map(item => parseInt(item));
```



还有一个注意点，`map()`方法只会在有值的索引上被调用，那些从来没有被赋过值或者使用delete删除的索引则不会被调用：

```javascript
let arr = [];
arr[2] = 1;
arr.map((item, index) => console.log(item, index));
//1 2

let arr2 = [];
arr2[0] = undefined; // 赋值
arr2[1] = undefined; // 赋值
arr2[2] = 1
arr2.map((item, index) => console.log(item, index));
// undefined 0
// undefined 1
// 2 2
```

