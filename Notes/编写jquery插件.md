```javascript
(function ($) {
  $.fn.myPlugin = function () {
    	//插件具体内容
    	//this指向调用插件的jQuery对象，不需要再$(this)
    	this.fadeIn("normal", function () {
          	//这里的this指向的就是DOM元素
    	})
        return this;
  };
})(jQuery);
```

以上之后就可以使用`$(element).myPlugin()`。

```javascript
(function ($) {
  $.fn.maxHeight = function () {
     var max = 0;
     this.each(function () {
       max = Math.max(max, $(this).height());
     });
     return max;
  };
})(jQuery);

var tallest = $("div").maxHeight();//返回最高div的高度
```

利用`$(element).height()`来返回页面中最高div的高度。



__保持链式调用__：

```javascript
(function ($) {
  	$.fn.lockDimensions = function (type) {
      	return this.each(function () {
          	var $this = $(this);
          	if(!type || type == "width") {
              	$this.width($this.width());
          	}
          	if(!type || type == "height") {
              	$this.height($this.height());
          	}
      	});
  	};
})(jQuery);

$("div").lockDimensions("width").css("color", "red");
```





__合理使用$.fn的命名空间__

```javascript
(function ($) {
  var methods = {
    init: function (options) {
      //TODO
    },
    show: function () {
      //TODO
    },
    hide: function () {
      
    },
    update: function () {
      
    }
  };
  $.fn.tooltip = function (method) {
    	//方法调用逻辑
    	if(methods[method]){
          	return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    	} else if (typeof method === "object" || !method) {
          	return methods.init.apply(this, arguments);
    	} else {
          	$.error("Method" + method + "does not exist on jQuery.tooltip");
    	}
  };
})(jQuery);

$("div").tooltip();//调用init方法

$("div").tooltip({ //调用init方法
  	foo: "bar"
});

$("div").tooltip("hide");//调用hide方法

$("div").tooltip("update", "This is the new tooltip content!");//调用update方法
```

