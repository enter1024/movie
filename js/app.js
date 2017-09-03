(function (angular) {
    //  模块
    var myModel = angular.module('app', [
        'ngRoute',
        'movie_list'
    ]);

    //  配置路由
    myModel.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
        otherwise({
            //  重定向(当点击a链接找不到路由中的when指定的path时就重定向到coming_soon)
            redirectTo: '/in_theaters/1'
        });
    }]);

    //  active配置控制器，控制左边点击后的样式，为被点击的添加active
    myModel.controller('ActiveController', ['$scope', '$location', function ($scope, $location) {
        $scope.locationPath = $location;
        $scope.$watch('locationPath.path()', function (newPath) {
            if(newPath.startsWith('/in_theaters')){
                $scope.item = 'in_theaters';
            }else if(newPath.startsWith('/coming_soon')) {
                $scope.item = 'coming_soon';
            }else if(newPath.startsWith('/top250')) {
                $scope.item = 'top250';
            }
        });
    }]);

    // search的控制器
    myModel.controller('SearchController', ['$scope', '$route', function ($scope,$route) {
        $scope.input = '';
        $scope.submitSearch = function () {
           $route.updateParams({item:'search', q:$scope.input});
        }

    }]);
    
    // 小屏幕下控制列表折叠
    // dom操作都放在指令的link属性中
    myModel.directive('itemCollapse',[function(){
        return {
            restrict : "A",
            link : function (scope, iEle, iAttr) {
                $(iEle).on('click', function () {
                    $('#top-right-nav-bar').removeClass('in');
                });
            }
        }
    }]);
})(angular);



