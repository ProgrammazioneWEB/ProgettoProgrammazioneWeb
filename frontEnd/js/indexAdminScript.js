//module for admin
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);

//route for admin
indexAdminApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/html/admin/adminHome/adminHome.html",
            controller: "adminHomeController"
        })
        .when("/alert", {
            templateUrl: "/html/admin/adminAlert/adminAlert.html",
            controller: "adminAlertController"
        }) 
        .when("/transaction", {
            templateUrl: "/html/admin/adminBonifico/adminBonifico.html",
            controller: "adminBonificoController"
        })
        .when("/userStats", {
            templateUrl: "/html/admin/adminUserVision/adminUserVision.html",
            controller: "adminUserVisionController"
        })
        .when("/activeUser", {
            templateUrl: "/html/admin/adminAbilita/adminAbilita.html",
            controller: "adminAbilitaController"
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


//define alert controller
indexAdminApp.controller('adminAlertController', function ($scope) {
        //alert to create
        $scope.alert = "";
        //Define function that create alert
        $scope.createAlert = function () {
            var alert = {
                alert: $scope.alert
            };
        };
        //define function that control if text area is null
        $scope.textAreaInvalida=function(){
            console.log($scope.alert.length);
            if($scope.alert.length<20){
                return true;
            }
            else{
                return false;
            }
        };
    });