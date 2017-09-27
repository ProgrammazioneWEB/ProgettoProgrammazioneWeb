var indexApp = angular.module('indexApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs', 'ngStorage', 'ngFileUpload']);

// create the controller and inject Angular's $scope
indexApp.controller('homeController', function ($scope, $localStorage) {
    //if exist a token
    if ($localStorage.XToken) {
      curToken = $localStorage.XToken;
    }
    //if exist a booleanAdmin
    if ($localStorage.BooleanAdmin) {
      BooleanAdmin = $localStorage.BooleanAdmin;
    }
    $scope.message = "Home Page";
    /**
   * DEFINE FUNCTION TO CONTROLL IF USER HAS LOGGED IN
   * return true if user logged in and false if not
   */
    $scope.controlIfLogin = function () {
      if (curToken.enable == true) {
        return true;
      }
      else {
        return false;
      }
    }
  });