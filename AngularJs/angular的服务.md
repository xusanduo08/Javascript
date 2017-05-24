> angular中，服务（service）用来提供特定的功能，它提供了一种能在应用的整个生命周期内保持数据的方法，它能够在控制器之间进行通信，并保持数据的一致性。

#### 在一个angular应用的声明周期中，服务是一个单例，被所有调用者所共享，所以利用这个特点，可以使用服务来实现controller之间的消息传递。



### 服务的调用

服务的调用采用__依赖注入__的方式。常见的调用方式如下：

```javascript
var app = angular.module("myApp",[])

app.run(function ($rootScope) {})  /*隐式注入*/

app.run(['$log', function (log) {}]) /*显式注入*/

app.run(fn);/*显式注入*/
function fn (log){
  log.error('$inject显式注入')
}
fn.$injector = ['$log']
```



### 服务的注册

angular提供了以下几种注册服务的方式：

1、provider：注册可配置的服务；

2、factory：注册服务的快捷方式，不可配置；

3、service：利用构造函数注册服务，不支持依赖注入；

4、value：注册简单的返回值服务，不支持依赖注入；

5、constant：注册常量服务，且在config函数中可调用；

6、decorator：拦截装饰现有服务，用于扩展或者重写服务。



1.provider方法

```javascript
app.provider("A", ["$logProvider", function (logProvider){
  var isDebug = true;
  this.debugEnabled = function (flag) {
    logProvider.debugEnabled(!!flag);
  }
  this.$get = ["$log", function (log) {
    return {
      debug: function (msg) {
        log.debug(msg);
      }
    };
  }];
}]);
```

上面provider方法创建了一个可配置的服务A，在应用中，我们可以在config函数中调用它的服务提供者（AProvider）对debugEnabled方法进行配置：

```javascript
app.config(function (AProvider) {
  AProvider.debugEnabled(false);
})
```

另外，我们看到，服务提供者具有一个$get方法。事实上，在初始化的时候，\$injector靠的就是调用\$get方法来创建服务实例。这样，我们在代码中才可以正常调用服务：

```javascript
app.run(function (A) {
  A.debug("A provider");
})
```



2、factory方法

```javascript
app.factory("B", function ($log) {
  return {
    debug: function (msg) {
      $log.debug(msg);
    }
  } 
})
```

factory创建的服务不可配置，该方法基于provider方法。factory中注册的函数相当于provider中的$get，所以，factory函数的返回值也就相当于服务的实例。调用很简单：

```javascript
app.run(function (B) {
  B.debug("B factory");
})
```



3、service方法

```javascript
app.service('C', function ($log) {
    this.debug = function (msg) {
        $log.debug(msg);
    };
});
```

service方法是比较常用的创建服务的方法，它不需要返回值，创建的是服务的构造函数，所以在使用的时候以实例化构造函数的方式生成服务实例。

```javascript
app.run(function (C) {
  C.debug("C factory");
})
```



4、value方法

如果服务的$get方法返回的是一个常量，那就没必要定义一个包含复杂功能的完成服务，可以通过value()函数方便的注册服务。

```javascript
app.value('E', {
    debug: function (msg) {
        console.log(msg);
    }
});
```

上面创建了一个服务E，服务实例就是注册的值，这地方是一个对象，当然也可以是其他类型的值。

```javascript
app.value('F', 'hello world');  /* 一个字符串*/
app.value('G', function () {    /* 或者一个函数*/
    console.log('hello world');
});
```



5、constant方法

```javascript
app.constant('D', 'D constant');
```

constant用来定义__常量__的服务，它的值可以使用任何类型。和value方法区别如下：

* constant方法定义的服务不可修改（毕竟是常量）
* constant方法定义的服务还可以在`config`函数中被调用



6、decorator方法

具体来讲，decorator不算是一个创建服务的方法，它其实是一个装饰现由服务的方法。它可以在服务实例创建时对其进行拦截，并对服务进行扩展，或者用另外的内容完全替代服务。

```javascript
app.config(function ($provide) {
    $provide.decorator('A', function ($delegate, $log) {
        $delegate.error = function (msg) {
            $log.error(msg);
        };
        return $delegate;   /* 注意：一定要返回修改的（或新的）服务实例*/
    });  
});
```

上面的代码对服务A进行了扩展，增加了error方法。

$delegate是可以进行装饰的最原始的服务，为了装饰其他服务，需要将其注入装饰器。（来自《AngularJs权威教程》）

另外，__调用decorator的是$provider，不是angular的模块。__