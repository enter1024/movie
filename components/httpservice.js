/**
 *  跨域发送http的模块(jsonp的方式)
 * Created by li on 2017/6/26.
 * 思路：
 * $window==window   $document==$document[0]
 * 1.拼接回调函数名
 * 2.将回调函数挂载到全局$window[funName] = callback;
 * 3.遍历传递进来的data对象，将键和值拼接成请求字符串
 * 4.创建script标签并指定src的path
 * 5.将script添加到body中
 * 6.为了提高性能，页面显示数据后，需要将添加进来的script标签删除
 */

(function (angular) {
    var http = angular.module('httpFromJsonp', []);
    http.service('HttpService', ['$window', '$document', function ($window, $document) {
         this.jsonp = function (url, data, callback) {
             var funName = 'func_' + Math.random().toString().replace('.', '');

             var requestStr = url.indexOf('?') == -1 ? '?' : '';
             for (var key in data) {
             requestStr += key + '=' + data[key] + '&';
             }
             requestStr += 'callback' + '=' + funName;
             var path = url + requestStr;

             var scriptElement = $document[0].createElement('script');
             scriptElement.src = path;
             //在添加script标签进页面前，一定要将回调函数挂载，因为一添加script标签到页面后就会通过src访问path,取回数据。
             //服务器返回数据成功后会调用callback()函数，callback()函数里面的代码会运行并渲染页面
             //不推荐直接挂载到全局上，污染全局
             $window[funName] = function (data) {
                 callback(data);
                 //callback()执行完毕后，自己将自己删除，页面就没有script标签了
                 $document[0].body.removeChild(scriptElement);
             };
             $document[0].body.appendChild(scriptElement);
         }
    }]);
})(angular);
