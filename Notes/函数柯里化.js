
plus(1)(2)(3)(4)

function plus(num){
	var adder = function(){
		var _args = [];
		var _adder = function _adder(){
			[].push.apply(_args, [].slice.call(arguments));
			return _adder;
		}
		_adder.toString = function (){
			return _args.reduce(function (a, b){
				return a + b;
			})
		}
		return _adder;
	}
	
	return adder()(num);
}