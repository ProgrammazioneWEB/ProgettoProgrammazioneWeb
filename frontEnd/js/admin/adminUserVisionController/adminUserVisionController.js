//define module
var indexAdminApp = angular.module('indexAngularApp', ['ngRoute']);


//define userVisionController

indexAdminApp.controller('adminUserVisionController', function ($scope) {
    //message
    $scope.message = "Benvenuto admin, da qui potrai controllare lo stato di un correntista";
    //count number insert by admin
    $scope.countNumber;
    //user data
    $scope.userData = null;
    //function to get userData from server
    $scope.getUserData = function () {
        //request http get with countNumber
        $scope.userData = {
            name: "Lorenzo",
            surname: "Stacchio",
            saldo: 50
        }
        //change message
        $scope.message = "Ecco qui i dati di" + userData.name + " " + userData.surname;
    };

    //function to check if user data were gotten or not 
    $scope.informazioniUserVuote = function () {
        if ($scope.userData === null) {
            return true;
        }
        else {
            return false;
        }
    };

    //function to resetUserSearch
    $scope.resetUser = function () {
        //change message
        $scope.userData = null;
        $scope.message = "Benvenuto admin, da qui potrai controllare lo stato di un correntista";
    }
});