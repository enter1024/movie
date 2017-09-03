/**
 *
 * Created by li on 2017/6/23.
 */

(function (angular) {
    var myModel = angular.module('movie_list', ['ngRoute', 'httpFromJsonp']);
    //  配置路由
    myModel.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/:item/:page', {
            templateUrl: 'movie_list/view.html',
            controller: 'MovieList'
        });
    }]);

    //  配置控制器
    myModel.controller('MovieList', [
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        function ($scope, $route, $routeParams, HttpService) {
            var requestCount = 3;                                   //每页显示的条数
            $scope.currentPage = parseInt($routeParams.page);          //从控制器参数中获取当前页的数值
            var startCount = ($scope.currentPage - 1) * requestCount;      //开始的条数
            //  初始化数据
            $scope.totalCount = 0;                                  //总条数
            $scope.totalPages = 0;                                   //总页数
            $scope.loading = true;                                  //是否显示加载动画
            $scope.datas = {title:'Loading...'};
            HttpService.jsonp(
                'https://api.douban.com/v2/movie/'+ $routeParams.item,
                {start: startCount, count: requestCount, q:$routeParams.q},
                function (data) {
                    $scope.datas = data;
                    $scope.totalCount = data.total;
                    $scope.totalPages = Math.ceil($scope.totalCount / requestCount);    //总页数
                    $scope.loading = false;
                    $scope.$apply();    //$apply()里面不传参数时会同步所有
                }
            );

            //  跳转到对应的页
            $scope.toPage = function (page) {
                if (page >= 1 && page <= $scope.totalPages){
                    $route.updateParams({page:page});
                }
            }
        }
    ]);


})(angular);