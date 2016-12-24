> 把一个对象（`{}`）转成字符串，会调用对象的`toString`方法，在不重写`toString`方法的情况下情况下会返回`[object Object]`例如，想在浏览器中`alert`一个`Object`实例，在默认情况下，这个对象会调用自身的`toString()`方法，转成字符串后`alert`显示，最后显示的结果就是`[object Object]`。如果想查看对象内部的具体情况，可以使用`JSON.stringify()`将对象转换成字符串输出，或者使用`console.log()`在控制台直接输出，或者使用`for...in`对对象属性进行枚举显示。
>
> ```
> var obj = {name:"mengfansheng", age:26};
> obj.toString();//"[object Object]"
>
> var arr = [1,2,3];
> Object.prototype.toString.call(arr);//"[object Array]"
> ```
>
> 针对以上知识，看下面一个题目：
>
> `({}) == '[object Object]'  	//true`
>
> 首先，上面的表达式在进行比较时会进行类型转化，这部分可以看[这里](http://javascript.ruanyifeng.com/grammar/conversion.html)和[这里](http://www.haorooms.com/post/js_yinxingleixing)，一个对象转换成字符串调用自身的`toString`方法，由于在不重写的`toString`方法的情况下该方法的返回值是`'[object Object]'`，所以说，这题最后比较的就是`'[object Object] == [object Object]'`，所以比较的结果就是`true`。