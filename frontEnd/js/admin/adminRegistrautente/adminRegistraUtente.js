var indexAdminApp = angular.module('indexAdminApp', ['ngRoute', 'ngStorage']);


//Define adminRegistraUtente
indexAdminApp.controller('adminRegistraUtente', function ($scope, $http, $window) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui potrai creare un nuovo conto corrente.Per crearlo" +
        " ti basterà inserire il nuovo numero di conto del cliente, assieme al pin per registrare il conto home banking e "
        + " la cifra iniziale versata dal cliente";
    //field to compile 
    $scope.pin = "";
    $scope.money = "";
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.dateOfBirth = "";
    $scope.numberOfPhone = "";
    $scope.residence = "";
    $scope.fiscalCode = "";
    //pin errors    
    $scope.pinErrors = { error: "" };
    //function to control pin
    $scope.checkPin = function () {
        if ($scope.pin === "" || $scope.pin === undefined) {
            $scope.form.pin.$invalid = true;
            $scope.pinErrors = { error: "Non hai scritto il pin!" };
        }
        else {
            $scope.pinString = $scope.pin.toString();
            if ($scope.pinString.length != 5) {
                $scope.form.pin.$invalid = true;
                $scope.pinErrors = { error: "Il pin deve essere lungo 5 cifre" };
            }
        }
    };
    //function to control if fields are correct
    $scope.checkForm = function () {
        if ($scope.pin == "" || $scope.money == "" || $scope.firstName == "" ||
            $scope.lastName == "" || $scope.dateOfBirth == "" || $scope.numberOfPhone == ""
            || $scope.residence == "" || $scope.fiscalCode == "")
            return true;
        else
            return false;
    }
    //function to register account
    $scope.registerUser = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/InserisciPin-admin',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'pin': $scope.pin,
                'firstName': $scope.firstName,
                'lastName': $scope.lastName,
                'dateOfBirth': $scope.dateOfBirth,
                'numberOfPhone': $scope.numberOfPhone,
                'residence': $scope.residence,
                'fiscalCode': $scope.fiscalCode,
                'quantity': $scope.money,
            }
        }).then(function (response) {
            if (response.data.success) {
                alert(response.data.message);
                $window.location.reload();
            }
            else {
                alert("Errore nel server o nel db");
            }
        });
    }
});