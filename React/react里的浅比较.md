#### react里的浅比较

​	react的PureComponent类的shouldCOmponentUpdate方法使用了浅比较来判断props和state是否发生变化，一些组件可以通过继承PureComponent来优化组件性能，减少不必要的re-render。但是有些组件即使继承了PureComponent也没有任何性能上的改变。我们来看看浅比较的原理。

```javascript
const hasOwnProperty = Object.prototype.hasOwnProperty;
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
//....
```

​	以上是react中浅比较的部分源码。`is`方法是es6中`Object.is`方法的实现，我理解主要是为了兼容低版本浏览器。

​	`Object.is()`方法能很好的对基本类型的数据进行比较，并且不会出现`==`时的类型转换，也不会产生`NaN!==NaN`为true的以及`-0 == +0`的情况。

```javascript
Object.is(null, undefined);//false
Object.is(NaN, NaN);//true
Object.is(-0, +0);//false
```

​	当比较的两个值满足下列情况时，`Object.is()`方法返回true：

* 都是`undefined`
* 都是`null`
* 都是`true`或者`false`
* 都是由相同字符组成的相同长度的字符串
* 指向的都是同一个对象
* 都是数字，并且
  * 都是+0
  * 都是-0
  * 都是非0且非NaN的相同值的数字

以上情况在比较的时候就会返回true。可以看出，`Object.is()`方法弥补了`==`和`===`比较的缺陷。

​	下面逐步解读一下`shallowEqual`方法

```javascript
const hasOwnProperty = Object.prototype.hasOwnProperty;
//声明is方法，兼容老浏览器
function is(x, y) {
  if (x === y) {
    //如果 x 严格等于 y，这里面有一种情况是需要特别注意的，就是-0===+0也是true
    //所以额外判断下两个参数是否有等于0的情况，-0 ！== 0 返回false
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // 如果两者不严格相等，也有中情况是需要额外处理的，就是NaN ===  NaN是返回false的
    // 所以特殊处理下，如果x严格不等于自己，y也严格不等于自己，则说明两者是NaN，这时候就要返回true
    return x !== x && y !== y;
  }
}

function shallowEqual(objA: mixed, objB: mixed): boolean {
  //判断objA和objB是否相等，相等直接返回true
  if (is(objA, objB)) {
    return true;
  }
  /*
  	如果不相等，那么就要看下两参数是否是对象，因为浅比较会进入到对象的第一层，不能仅引用不一样就
  	直接返回false了。
  	此外，如果两者有一个参数为null，那也不用继续下去了，两者已经不相等了，并且至少有一个为null，则
  	表示肯定有变化发生了，shallowEqual可以直接返回false
  */
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }
  //如果是对象，同时两者又没有null，则开始进入到对象的第一层来比较
  //获取两个对象的key值数组
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  //如果属性长度都不一样，则表示两者不相等，返回false
  if (keysA.length !== keysB.length) {
    return false;
  }

  //接下来一个属性一个属性的比较
  //如果objA的属性objB没有，或者两者同一个属性的值不相等，则表示objA和objB不相等，返回false
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```

​	通过上面的代码的可以看出（尤其最后一段），所谓浅比较只会进入到对象的第一层，如果对象的属性值仍然是对象，这时候是不会递归进入到属性内部去比较的，如果属性值前后指向的是不同的引用，即使引用对象的内部属性值都是一样，shallowEqual返回的结果仍会是false。如果想此时仍能使用PureComponent达到性能优化的结果，则必须保证属性所指向的都是同一个引用。

​	综上，PureComponent有性能优化的功能，前提是组件接收的props或者组件内部的state结构比较简单。如果props或者state嵌套比较深（有两层及以上的嵌套），则可能就没法通过shallowEqual比较出变化，这也是有些组件使用了PureComponent后没有发现有任何性能上的优化的原因。