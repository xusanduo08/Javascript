### Set

ES6中添加了新的数据结构Set，我觉得它和Java里的Set的一些性质差不多。Set的成员的值是唯一的，没有重复的值。

Set本身是一个构造函数，用来生成Set函数。

```javascript
const s = new Set();
[2,3,4,5,2,2,2,2].forEach(x => s.add(x));

for(let i of s){
  	console.log(i);
}
//2,3,4,5
```

`add()`方法用来向Set结构中添加元素（和Java类似）。上面的代码表示，Set不会添加重复的值。

Set函数可以接受一个数组（或类数组对象）作为初始化参数。

```javascript
var set = new Set([1,2,3,4,5,5]);
[...set];//[1, 2, 3, 4, 5]

var items = new Set([1,2,3,4,5,6,5,6,6]);
items.size;//6

function divs(){
  	return [...document.querySelectorAll('div')];
}
var set = new Set(divs());
set.size;//11

//类似于
divs().forEach(div => set.add(div));
set.size;//11
```

上面代码中，第一种和第二种情况都是使用数组作为参数，第三种情况使用类数组对象作为参数。从上面代码中也可以得到一种数组去重的方法。

```javascript
//去除数组的重复成员
[...new Set(array)];
[...new Set([1,2,3,4,4,4])];//[1, 2, 3, 4]
```

向Set中加入值得时候，不会发生类型转换，所以5和"5"是两个不同的值。Set内部判断两个是否不同用到的方法类似于精确相等运算符（===），主要区别在于`NaN`，而精确相等运算符认为`NaN`不等于自身。

```javascript
var set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set;//{NaN}
```

上面的代码想Set中添加了两个NaN，但是只能加入一个。这表明，在Set内部，两个NaN是相等的。

另外，两个对象总是不相等。

```javascript
let set = new Set();
set.add({});
set.size;//1

set.add({});
set.size;//2
```

上面代码表示，由于两个空对象不相等，所以它们被视为两个值。