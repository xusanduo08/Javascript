* 实现了react-redux中connect方法的功能，用法一样，跑通了react-redux中connect方法的所有测试用例
* 对方法的入参要做校验，是否传入，传入的是否符合要求，都要进行校验，对没传入参数或者参数不符合要求的情况要做容错处理，确保程序不会崩溃，同时要有信息输出，告知哪里不合要求。
* 通过高阶函数提高可重用性。
* 高阶函数：延迟计算，
* __命令式__代码中频繁使用语句，而__声明式__代码中更多依赖表达式。
* __函数柯理化__：将多参函数转换成一系列的单参函数

```javascript
let add = (a, b) => a + b;
//柯里化之后
let add = a => b => a + b;
```

* 组合函数compose

```
array.reduce(fn[, initialValue]);
//redux中用到的是reduceRight，从右边开始
```

* 计算数组中某一元素出现的次数

```
const names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
let countedNames = names.reduce((allNames, name) =>{
  if(name in allNames){
    allNames[name]++;
  } else {
    allNames[name] = 1;
  }
  return allNames;
}, {})

```

* 数组扁平化处理

```
var flattened = [[0, 1], [2, 3], [4, 5]].reduce((a, b) => {
  return a.concat(b);
}, [])
// flattened is [0, 1, 2, 3, 4, 5]
```

* 按照属性分组对象

```
const people = [
  { name: 'Alice', age: 21 },
  { name: 'Max', age: 20 },
  { name: 'Jane', age: 20 }
];

let groupBy = (objectArr, prop) =>{
  return objectArr.reduce((acc, obj) => {
    let key = obj[prop];
    if(!acc[key]){
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {})
}
```

