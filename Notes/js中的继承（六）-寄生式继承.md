### 寄生式继承

```
var book = {
  	name: "js book",
  	alikeBook: ["css book", "html book"]
};

function inheritObject (o){
  	//过渡对象
  	function F(){};
  	//过渡对象的原型继承父对象
  	F.prototype = 0;
  	//返回一个过渡对象的实例，该实例的原型继承了父对象
  	return new F();
}
function createBook(obj){
  	//通过原型继承方式创建新对象
  	var o = new inheritObject(obj);
  	//扩展新对象
  	o.getName = function(){
      	console.log(name)
  	};
  	//返回扩展后的新对象
  	return o;
}
```

这种继承方式就是对原型继承的第二次封装，在第二次封装过程中对继承的对象进行了扩展，这样新创建的对象不仅仅有父类中的属性和方法而且还添加了新的属性和方法。