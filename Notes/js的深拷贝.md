```javascript
function deepCopy(source){
  	var result = {};
  	for(var key in source){
      	if(typeof source[key] === "object"){
      		result[key] = deepCopy(source[key])
      	}else{
          	result[key] = source[key]
      	}
  	}
  	
}
```

