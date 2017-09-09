//module for admin
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);
//controller for admin
indexAdminApp.controller('adminHomeController', function ($scope) {
    //admin image path
    $scope.adminImagePath = adminProfile.imagePath;
    //name and surname
    $scope.name=adminProfile.name;
    $scope.surname=adminProfile.surname;
    $scope.idNumber=adminProfile.idNumber;

});