providerCache.$injector =
    createInternalInjector(providerCache, 
        function(serviceName, caller) {
            if (angular.isString(caller)) {
              path.push(caller);
            }
            throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' <- '));
        }
    )
//推断式注入
injector.invoke(function($http, greeter){})

//显示注入声明
aControllerFactory.$inject = ["$scope", "greeter"];

//行内式注入声明
app.controller("myController", ["$scope", "$http", function($scope, $http){

}])

//定义module的三种方式
angular.module(function($httpProvider){});
angular.module(["$httpProvider", function($httpProvider){}]);
angular.module("myModule", [dependency]);