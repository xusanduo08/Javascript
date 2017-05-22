每个angular应用都有一个唯一的`$rootScope`，每个controller中创建的`$scope`则通过原型继承自`$rootScope`。我们可以通过__依赖注入__的方式在控制台获取`$rootScope`：

```
var injector = angular.injector(['ng']);
injector.invoke(['$rootScope', function (scope) {
  window.scope = scope;
}])
```

在angular中，存在`Scope()`构造函数，用来创建应用中用到的作用域对象。

```javascript
function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this.$root = this;
      this.$$destroyed = false;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$$isolateBindings = null;
    }
```

除了上面的实例属性外，还有一些共享属性：

```javascript
Scope.prototype = {
  constructor: Scope,

  $new: function(isolate) {...},

  $watch: function(watchExp, listener, objectEquality) {...},

  $watchGroup: function(watchExpressions, listener) {...},

  $watchCollection: function(obj, listener) {...},

  $digest: function() {...},

  $destroy: function() {...},

  $eval: function(expr, locals) {...},

  $evalAsync: function(expr) {...},

  $apply: function(expr) {...},

  $applyAsync: function(expr) {...},

  $on: function(name, listener) {...},

  $emit: function(name, args) {...},

  $broadcast: function(name, args) {...}
};
```

`$new`：返回一个Scope实例；

`$watch`：给监听队列添加监听对象；

`$digest`：循环`$watch`队列，执行脏检查；

`$apply`：在`angular context`中执行代码，并进行`$digest`操作；

`$on`：监听事件；

`$emit`：发布事件（子元素向父元素）；

`$broadcast`：广播事件（父元素向子元素），所有订阅该事件的子元素都会响应事件。