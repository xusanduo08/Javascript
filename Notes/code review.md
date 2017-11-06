代码review心得：

* 关键代码需要注释

>例如，一些地方需要flag来标识判断条件，这个时候就需要明确说明该变量表示什么意思

```javascript
$Gadget.isMainOffer = true;//标识是否是主商品，true-是主商品，false-非主商品
if($Gadget.isMainOffer){
  
}
```

* 正则需要注释

> 用到正则表达式的地方，需要明确注释，写明该正则用来匹配符合哪些条件的字符串

```javascript
var regex = /^[1-9][0-9]$/;//匹配以1-9开头和以0-9结束的至少2位的一串数字
```

* 对象内部引用对象自身方法使用__this__代替

> 处于对象的命名空间下，使用对象自身的方法，可以使用this.方法名，这样在对象名称更改之后，不用再去修改对象内部方法中涉及到对象命名空间的地方。

```javascript
var $Controller.createSub = {
  init: function(){
    //...
  },
  checkout: function(){
    this.validateOrder();//使用this.方法名，而不是$Controller.createSub.validateOrder()
  },
  validateOrder: function(){
    //...
  }
}
```



