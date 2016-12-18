/*
	定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点
*/

var Singleton = function(name){
	this.name = name;
	this.instance = null;
}
Singleton.prototype.getName = function(){
	console.log(this.name);
}
Singleton.getInstance = function(name){
	if(!this.instance){
		this.instance = new Singleton(name);
	};
	return this.instance;
}
var a = Singleton.getInstance("sven1");
var b = Singleton.getInstance("sven2");

console.log(a ===b); //true

//或者用下面方式实现
var Singleton = function(name){
	this.name = name;
};
Singleton.prototype.getName = function(){
	console.log(this.name);
};
Singleton.getInstance = (function(){
	var instance = null;
	return function(name){
		if(!instance){
			instance = new Singleton(name);
		}
		return instance;
	}
})();

//透明的单例模式
var CreateDiv = (function(){
	var instance;
	var CreateDiv = function(html){
		if(instance){
			return instance;
		};
		this.html = html;
		this.init();
		return instance = this;
	};
	CreateDiv.prototype.init = function(){
		var div = document.createElement("div");
		div.innerHTML = this.html;
		document.body.appendChild(div);
	};
	return CreateDiv;
})()

var a = new CreateDiv("sven1");
var b = new CreateDiv("sven2");
console.log(a == b);

//用代理实现单例模式

var CreateDiv = function(html){
	this.html = html;
	this.init();
};
CreateDiv.prototype.init = function(){
	var div = document.createElement("div");
	div.innerHTML = this.html;
	document.body.appendChild(div);
};

var ProxySingletonCreateDiv = (function(){
	var instance;
	return function(html){
		if(!instance){
			instance = new CreateDiv(html);
		};
		return instance;
	}
})();
var a = new ProxySingletonCreateDiv("sven1");
var b = new ProxySingletonCreateDiv("sven2");
console.log(a === b);

//使用闭包封装私有变量
var user = (function(){
	var _name = "sven";
	var _age = 29;
	return {
		getUserInfo: function(){
			return _name + "-" + _age;
		}
	}
})();


/*
	通用的惰性单例
	var obj;
	if(!obj){
		obj = XXX;
	}
*/
var getSingle = function(fn){
	var result;
	return function(){
		return result || (result = fn.apply(this, arguments));
	}
};

var createLoginLayer = function(){
	var div = document.createElement("div");
	div.innerHTML = "login";
	div.style.display = "none";
	document.body.appendChild(div);
	return div;
};

var createSingleLoginLayer = getSingle(createLoginLayer);
document.getElementById("loginBtn").onclick = function(){
	var loginLayer = createSingleLoginLayer();
	loginLayer.style.display = "block";
}
