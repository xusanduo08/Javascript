```
var jQuery = function(selector){
  return new jQuery.fn.init(selector);
}

jQuery.prototype = {
	constructor:jQuery,
  init:function(selector){
  	this[0] = document.getElementById(selector);//将获取到的元素作为当前对象的属性值保存
  	this.lenght = 1;
    return this;
  }
}
jQuery.fn.init.prototype = jQuery.prototype = jQuery.fn
  

```

