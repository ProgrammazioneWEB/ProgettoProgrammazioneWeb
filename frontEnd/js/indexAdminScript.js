//module for admin
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);

//route for admin
indexAdminApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/html/admin/adminHome/adminHome.html",
            controller: "adminHomeController"
        })
        .when("/mainHome", {
            templateUrl: "/html/admin/adminHome/adminHome.html",
            controller: "changeSite"
        })
});

//global variable of admin data
var adminProfile = {
    name: "Lorenzo",
    surname: "Stacchio",
    idNumber : "124356",
    imagePath: "/CSS/images/Fondatori/Ls.png",
};

//controller for admin
indexAdminApp.controller('adminHomeController', function ($scope) {
    //admin image path
    $scope.adminImagePath = adminProfile.imagePath;
    //name and surname
    $scope.name=adminProfile.name;
    $scope.surname=adminProfile.surname;
    $scope.idNumber=adminProfile.idNumber;

});

//controller for admin
indexAdminApp.controller('changeSite', function ($window) {
    //admin image path
    $window.location.href="../index.html";

});