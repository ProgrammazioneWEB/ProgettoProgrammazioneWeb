//define module
var indexAdminApp = angular.module('indexAngularApp', ['ngRoute']);


//define userVisionController
indexAdminApp.controller('adminUserVisionController', function ($scope, $http) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui potrai controllare lo stato di un correntista";
    //count number insert by admin
    $scope.countNumber = undefined;
    //errors to show
    $scope.countNumberErrors = { error: "" };
    //user data
    $scope.userData = null;
    //function to controll countNumber
    $scope.controlCountNumber = function () {
        //save pin like string
        $scope.countNumberString = $scope.countNumber.toString();
        if ($scope.countNumber === undefined) {
            $scope.form.countNumber.$invalid = true;
            $scope.countNumberErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else if ($scope.countNumberString.length < 6) {
            $scope.form.countNumber.$invalid = true;
            $scope.countNumberErrors = {
                error: "*Il pin è troppo corto"
            };
        }
        else if ($scope.countNumberString.length > 6) {
            $scope.form.countNumber.$invalid = true;
            $scope.countNumberErrors = {
                error: "*Il pin è troppo lungo"
            };
        }
        else {
            $scope.form.countNumber.$invalid = false;
            $scope.countNumberErrors = {
                error: ""
            };
        }

    };
    //function to get userData from server
    $scope.getUserData = function () {
        //get user data from server
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/userDataNAccount',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumber
            }
        }).then(function (response) {
            //if succes
            if (response.data.success) {
                $scope.userData = response.data.result;
                //change message
                $scope.message = "Dati del correntista " + $scope.userData.numberOfAccount;
                //define some local variable
                $scope.userName = $scope.userData.meta.firstName;
                $scope.userSurname = $scope.userData.meta.lastName;
                $scope.userEmail = $scope.userData.email;
                $scope.userMoney = $scope.userData.availableBalance + " €";
                $scope.userResidence = $scope.userData.meta.residence;
                $scope.userPhoneNumber = $scope.userData.meta.numberOfPhone;
                $scope.userEnable = $scope.userData.active;
                $scope.userDateOfCreation =$scope.userData.dateOfCreation;
                //control user image path, if string contains nothing replace it 
                if ($scope.userData.image == "") {
                    //give a default image
                    $scope.userImagePath = "../CSS/images/iconsForUser/user_default.jpg";
                }
                else
                    $scope.userImagePath = $scope.userData.image;
            }
            else {
                alert("Non esiste un correntista con questo numero di conto");
            }
        });
    };

    //function to check if user data were gotten or not 
    $scope.informazioniUserVuote = function () {
        if ($scope.userData == null) {
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