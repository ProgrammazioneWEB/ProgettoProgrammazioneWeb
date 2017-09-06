var indexApp = angular.module('indexApp', ['ngAnimate', 'ngTouch']);

// create the controller and inject Angular's $scope
indexApp.controller('homeController', function ($scope) {
  //message
  $scope.message = "Home Page";
});


