> 什么是指令：指令可以理解为一个具有“特殊行为”的html标签。这些特殊行为使我们可以自定义的。

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



> 指令中的controller

指令的定义参数中有一项为controller，其值可为字符串或者函数。如果是字符串，angular会到已经注册的controller中寻找对应的controller，并进行引用，并且controller实例会作为参数引入到link的第4个参数中。

```javascript
app.controller("myController", function ($scope) {
  $scope.name = "mengfansheng";
  this.name = "main";
})

app.directive("myDirective", function () {
  return  {
    controller:"myController",
    link: function (scope, elem, attrs, ctrl){
      console.log(ctrl, scope)
    }
  }
})
```

如果是一个函数，则该函数就作为该指令的匿名controller，该匿名controller同样会作为link函数的第4个参数引用着。

```javascript
app.directive("myDirective", function () {
  return  {
    controller:function ($scope){
      $scope.name = "mengfansheng";
  	  this.name = "main";
    },
    link: function (scope, elem, attrs, ctrl){
      console.log(ctrl, scope)
    }
  }
})
```

另外有一点，__我们在页面上一直都是用的某一个controller中的`$scope`对象上的数据，加假如我们想使用某个controller实例上的数据呢，例如我们在上面代码中给controller自身也添加了属性`this.name = "main";`，如何在页面上使用这个属性？答案是使用`as`关键字__。

```javascript
<div ng-controller='myController as ctrl'>
	<h1>{{ctrl.name}}</h1>
</div>
```



> 指令中的require

require参数可以在一个指令中引用另外一个指令的controller，并将其作为参数注入到require所在指令的link函数的第4个参数位置。

```html
<div my-parent>
	<div my-child></div>
</div>
```

```javascript
app.directive("myParent", function (){
  return {
    restrict: "EA",
    controller: function () {
      this.name = "I love mengfansheng";
    },
    link: function (){
      //...
    }
  }
})

app.directive("myChild", function () {
  return {
    restrict: "EA",
    require: "^myParent",//注意这里有个'^'
    template: "<h1>{{name}}</h1>",
    link: function (scope, elem, attr, ctrl) {
      scope.name = ctrl.name + "very much"
    }
  }
})
```

require的值决定着如何去寻找对应的controller：

1. require: ‘myParent’ 表示只从当前节点上获取myParent指令的controller实例。
2. require: ‘^myParent’ 表示从当前节点上获取myParent指令的controller实例开始，如果获取不到则一直从parent节点上取。
3. require: ‘?myParent’，’^?myParent’ 或者 ‘?^myParent’ 加上问号，表示获取不到controller实例也不会报错。

此外，require值可以是一个数组，如果是数组，那么link函数的第4个参数也就是一个数组，此时就需要通过下标来访问对应的controller实例。



以上，我们可以看出以下事实：

1、link函数中的逻辑只可以被本指令使用，不能也无法共享；

2、由于controller可以被require，也可以直接只用controller参数执行要使用的controller，所以，controller中的方法可以被指令共享。因此，__对于一些需要共享的方法可以放在controller中__，实现代码复用，减少重复劳动。