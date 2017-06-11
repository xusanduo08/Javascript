```javascript
var obj1 = {
  name:"mengfansheng";
};
 
var obj2 = {
  name:"dasheng";
};
 
function changeStuff(obj){
  obj.name="fansheng"
  obj = obj2;
  return obj.name;
}
 
var foo = changeStuff(obj1);//输出结果应该是多少？？
```

​	强调唯一一点：__js中所有函数的参数都是按值传递的__，不论基本类型还是引用类型，都是将自身存储的值的副本给参数（基本类型的变量直接将变量所存储值的副本给参数，引用类型的变量直接将自身所存储的引用地址的副本给参数,多说一点，__赋值操作也是按值传递的__）。

​	所以，有了上面的前提，我们想一下就可以知道，对于基本类型的值，作为参数传递进函数内部后，无论函数内部怎么对传入的参数的值改变，原来的变量的值是不会变的。

```javascript
var content="前端不就html、js、css么";

function changeContent(content){
  content = "你行你来啊，屁话那么多"
}

changeContent(content);

console.log(content);//前端不就html、js、css么
```

`changeContent()`对传入的参数进行了重新赋值，因为__按值传递__，所以，不论函数内部对参数的值进行了如果处理，外界的`content`变量值不变。

​	

​	引用类型的变量稍微复杂一点，但原理都是一样的。引用类型的变量存储的值是一个地址，所以，如果引用类型作为参数传递到函数内部，函数外界变量的值（引用地址）依然是不会受到影响的，不同的是，因为函数内部和外部拿到的都是同一个引用地址，所以，如果函数内部对引用地址所指向的对象进行修改，是可以反映到函数外界的变量上的（__因为引用的都是同一个对象__）。

```javascript
var person1 = {
  name:"mengfansheng",
  age:26
}

var person2={
  name:"fansheng",
  age:27
}

function changePerson(person){
  person.name = "dasheng";
  person = person2;
  
  return person;
}

var result = changePerson(person1);

console.log(result.name);//"fansheng"
console.log(person1.name);//"dasheng"
```

​	`person1`所存储的的引用地址的副本传递给了函数，函数内部对这个引用地址所指向的对象的`name`属性进行了修改，此时，这个引用地址存储在函数内部的`person`变量上，但是接下来，函数又将`person2`变量赋值给了`person`，`person`中存储的引用地址指向了`person2`对象。所以，函数最终返回的是`person2`对象。

​	这个地方可能有人会晕，` person = preson2;`这一步操作后，`person1`不应该就是`person2`么？大哥，这一步仅仅是将`person2`的引用地址的副本传给了`person`，并没有对`person`所指向的对象进行修改。而`person.name = "dasheng";`则是对`person`所指向的对象进行了修改。

​	综上，最后的结果，`result.name `为`fansheng`，而`person1.name`为`fasheng`。



说了这么多，其实就一句话： __js中只有按值传递__。

