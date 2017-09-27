// create the module for the indexUser
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch',
'zingchart-angularjs', 'ngStorage',]);
//modify meta controller
indexUserApp.controller('userModifyMetaController', function ($scope, $http, $window) {
    $scope.message = "Benvenuto " + userProfile.meta.firstName + ", da qui potrai modificare le tue credenziali!";
    //assign data to show 
    $scope.oldResidence = userProfile.meta.residence;
    $scope.oldMail = userProfile.email;
    $scope.oldPhoneNumber = userProfile.meta.numberOfPhone;
    $scope.oldPassword = userProfile.password;

    //errori rilevabili nei campi
    $scope.mailError = { mail: "" };
    //filter used to filter e-mails
    var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

    //function to control username field and show the errors if user wrong to type 
    $scope.controlMailField = function () {
        //if length is 0 user has type nothing
        if ($scope.newMail === undefined) {
            //username value is empty
            $scope.mailError = { mail: "*E-mail non scritta" };
            $scope.form.newMail.$invalid = true;
        }
        else {
            if (!emailFilter.test($scope.newMail)) {
                //username value fail the test 
                $scope.mailError = { mail: "*Mail in formato errato" };
                $scope.form.newMail.$invalid = true;
            }
            else {
                //username is in an acceptable structure
                $scope.mailError = { mail: "" };
                $scope.form.newMail.$invalid = false;
            }
        }
    }
    //function that active button to modify data if at least one field is compiled
    $scope.activeForm = function () {
        //user have to compile at least one form field
        if (($scope.newMail != undefined && $scope.newMail != "")
            || ($scope.newResidence != undefined && $scope.newResidence != "")
            || ($scope.newPassword != undefined && $scope.newPassword != "")
            || ($scope.newPhoneNumber != undefined && $scope.newPhoneNumber != "")) {
            return true;
        }
        else return false;
    }
    //function to modify data, contact with server and db
    $scope.modifyData = function () {
        //control data, if field are empty i declare it null for backend reason
        if ($scope.newEmail == undefined || $scope.newEmail == "") {
            $scope.newEmail = null;
        }
        if ($scope.newPassword == undefined || $scope.newPassword == "") {
            $scope.newPassword = null;
        }
        if ($scope.newResidence == undefined || $scope.newResidence == "") {
            $scope.newResidence = null;
        }
        if ($scope.newPhoneNumber == undefined || $scope.newPhoneNumber == "") {
            $scope.newPhoneNumber = null;
        }
        //call server api
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/updateUserData',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'email': $scope.newEmail,
                'password': $scope.newPassword,
                'phone': $scope.newPhoneNumber,
                'residence': $scope.newResidence
            }
        }).then(function (response) {
            if (response.data.success) {
                alert(response.data);
                $window.location.reload();
            }
            else {
                alert(response.data.message);
            }
        });
    }
});