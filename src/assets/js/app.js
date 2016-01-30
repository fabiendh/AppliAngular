(function(angular){
  'use strict';

  angular.module('myApp',[
    'ngRoute',
    'ngMap',
    'LocalStorageModule',
    'helloModule', 'ContactModule', 'CheckinModule',
  ])

  .config(function($routeProvider) {
    $routeProvider
        .when('/', {
          templateUrl:'assets/template/checkinList.html',
        })
        .when('/checkin/:checkinId', {
          templateUrl:'assets/template/checkinDetails.html',
          controller: 'CheckinDetailsController'
        });
  });

})(window.angular);
