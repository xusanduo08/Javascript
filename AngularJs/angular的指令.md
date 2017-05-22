> 什么是指令：指令可以理解为一个具有“特殊行为”的html标签。指令可以完成简单或者复杂的一些逻辑操作，这些操作可以通过angular的一些命令进行定义。

比例，angular自带的指令，`ng-repeat`可以创建循环列表，`ng-click`可以实现点击事件绑定，这些都是具有特殊行为的html标签。利用这些指令可以完成一些页面的渲染、事件绑定等操作。



> 指令如何定义：angular中通过directive()方法定义指令。

```javascript
angular.module('myApp', [])
	.directive('myDirective', function(){
      return {
        restrict: "A",
        replace: true,
        scope: true,
        template: '<span>hello world</span>',
        compile: function (tElem){
          console.log('compile:', tElem);
          return function (scope, elem){
            console.log('link:',elem);
          }
        }
      }
	})
/*
	指令定义中的参数中比较难理解我认为有scope、compile和link，这三个参数分别涉及了指令的作用域、编译和链接的过程。
*/
```

`module.directive()`方法只是存储了一个准备实现的指令，并没有在应用内注册该指令。指令的注册是在angular的compile过程中，当第一次编译到某一个指令的时候通过调用`$compileProvider.directive()`去注册指令。

`module.directive()`第二个参数为一个函数，该函数返回__指令对象__，指令对象的各种属性决定了指令的行为。该函数支持依赖注入，所以，注册指令可以有以下几种方式：

```javascript
//普通方式定义定义
app.directive('myDirective', function(){
  return function () {
    console.log('postLink');
  }
})

//隐式注入
app.directive('myDirective', function ($injector) {
  return function (){
    console.log('postLink', $injector);
  }
})

//显式注入
app.directive('myDirective', ['$injector', function ($injector){
  return function () {
    console.log('postLink:', $injector);
  }
}])
```



> 指令的编译运行

angular在启动后会先去加载依赖的其他module，之后从根节点开始编译过程，编译过程分为两步：

第一步：传递应用根节点给$compile函数，开始编译，返回link函数。

第二部：传递根作用域给link函数，开始连接（每个指令分为pre link和post link）。

指令对象具有compile和link两个属性，其中compile函数的返回值会被用作link字段（可以返回函数或者对象，函数直接作为postLink，对象则具有pre和post两个属性，分别对应preLink和postLink），所以存在下面两种情况：

1、compile字段存在时，link字段将被忽略，compile函数的返回值将作为link字段。

2、compile字段不存在时，link字段存在，angular通过`directive.compile=valueFn(directive.link);`包装一层，使用用户定义的link字段。

```javascript
app.directive('myDirective', function() {
  return  {
    compile: function () {
      /*
      	返回一个对象，具有pre和post属性，分别对应preLink和postLink
      */
      return {
        pre: functon () {
          console.log('preLink');
        },
        post: function () {
          console.log('postLink');
        } 
      }
    }
  }
})

//返回一个函数，该函数将作为指令的postLink函数。
app.directive('myDirective', function () {
  return function () {
    console.log('postLink')
  }
})
```

所有指令都是先compile，然后preLink，然后postLink。节点的preLink是在所有子节点的preLink和postLink之前，__所以一般可以在这一步通过scope给子节点传递一定的信息__。节点的postLink是在所以子节点指令preLink、postLink之后进行，也就是说，当子节点进行postLink时，父节点还未进行postLink；父节点执行postLink时，子节点postLink已经都完成了，此时dom树已经稳定，所以，大部分dom操作，访问子节点都在这个阶段。preLink和postLink的执行顺序是一个相反的方向。__父指令的postLink总是在子指令的preLink和postLink之后执行，而父指令的preLink总是在子指令的preLink和postLink之前执行__。



> 指令的scope

指令的编译过程伴随着作用域的创建，这个作用域跟指令相关。作用域是可以继承过来的，也可以是孤立的，这都通过scope字段来控制：

> scope:true，创建一个继承自父作用域的子作用域，子指令拥有自己的作用域，同时也可以访问父指令的作用域；
>
> scope:false，不创建任何作用域，将父作用域当做当前作用域，子指令对数据的任何修改都会影响到父作用域；
>
> scope:{...}，创建孤立作用域，子作用域和父作用域没有任何联系。

孤立作用域是一个单独存在的作用域，没有继承关系，也不直接引用父作用域。angular中为了实现在孤立作用域中访问父作用域，使用当前节点的属性作为数据传递桥梁，父作用域可以传递数据给节点属性，孤立作用域便可以通过一个映射关系来访问这个节点属性来获取数据，从而达到访问父作用域的目的。

三种访问父作用域的方式：

1、@attrName：单向绑定，孤立作用域的任何改变不会影响到父作用域，父作用域的改变则影响着孤立作用域。

2、=attrName：双向绑定，孤立作用域和父作用域的任何改变都会影响着对方。

3、&attrName：函数绑定，指定调用父作用域的某个方法。



后面还有指令的controller、require等也是很有意思，先不写了。

