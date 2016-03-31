angular.module('satellizer')
.controller('LoginController', function($scope, $auth) {

  $scope.authenticate = function(provider) {
    console.log("test auth");
    $auth.authenticate(provider);
    console.log("mail "+$scope.email);
    console.log("pwd "+$scope.password);
    //console.log($scope.isAuthentificate);
    //$auth.login();
    //console.log($auth.login());
  };

  $scope.submit = function submitAuth() {
    console.log("test auth2");
    console.log("mail "+$scope.email);
    console.log("pwd "+$scope.password);
    var user = {
      email: $scope.email,
      password: $scope.password
    };
    $auth.login(user);
  };

  $scope.deco = function deco(){
    $auth.logout();
  };


  $scope.checkAuth = function(){
    console.log("check co: "+$auth.isAuthenticated());
    $scope.testAuth = $auth.isAuthenticated();
  };
});
