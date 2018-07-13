function patternMatches(pattern, str){
	if(!pattern.includes('*')){
		//没有通配符*，则必须全等于
		return pattern === str;
	}
	
	const startIndex  = pattern.indexOf('*');
	const leftPattern = pattern.substr(0, startIndex);
	const rightPattern = pattern.substr(startIndex + 1);
	
	if(leftPattern !== str.substr(0, startIndex)){
		return false;
	}
	
	if(rightPattern.length === 0){
		return str.startsWith(leftPattern);
	}
	
	for(let numChars = 0;numChars < str.length - startIndex;++numChars){
		if(patternMatches(rightPattern, str.substr(startIndex + numChars))){
			return true;
		}
	}
	
	return false;
}

//patternMatcher('a*b', 'aabb')  true
//patternMatcher('a*b', 'aabbc')  false
//patternMatcher('ab*', 'abc')  true
//patternMatcher('a*b*c', 'abc')  true
//patternMatcher('a*b*c', 'aaaabccc')  true

//arr[i][j] 表示p[:i-1]与s[:j-1]的匹配情况
function patternMatches(pattern, str){
	if(!pattern.includes('*')){
		return pattern === str;
	}
	
	const arr = [];
	for(let i = 0; i <= pattern.length; i++){
		arr.push([]);
		for(let j = 0; j <= str.length; j++){
			arr[i].push(false);
		}
	}
	
	arr[0][0] = true;
	
	for(let i = 1; i < pattern.length; i++){
		arr[i][0] = pattern === '*';
	}
	
	for(let i = 1; i <= pattern.length; i++){
		for(let j = 1; j<= str.length; j++){
			if(pattern[i - 1] === '*'){
				//*代表空字符或者多个字符
				arr[i][j] = arr[i - 1][j] || arr[i][j - 1];
			} else {
				arr[i][j] = pattern[i - 1] === str[ - 1] && ar[i - 1][j - 1];
			}
		}
	}
	return arr[pattern.length][str.length]
}
