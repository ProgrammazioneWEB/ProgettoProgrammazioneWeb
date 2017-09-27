//define model
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);


//define alert controller
indexAdminApp.controller('adminAlertController', function ($scope, $http, $localStorage, $window,$filter) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", nella sezione avvisi! Cosa vuoi fare?";
    //alert to create
    $scope.alert = "";
    //alert getted
    $scope.alerts = {};
    //booleans that have the function to show respectively
    $scope.decisioneCreaNonPresaB = true;
    $scope.decisioneEliminaNonPresaB = true;
    //functions that have the duty of showing section
    $scope.showCrea = function () {
        $scope.message = "Da qui potrai scrivere un avviso da inviare a tutti coloro che" +
            "posseggono un conto Bancario presso la nostra Banca." +
            "Ricorda che l'avviso dovrà avere almeno 20 caratteri!";
        $scope.decisioneCreaNonPresaB = false;
        $scope.decisioneEliminaNonPresaB = true;
    };
    $scope.showElimina = function () {
        $scope.message = "Da qui potrai eliminare un avviso. Scegli un avviso tra quelli creati e" +
            "seleziona il comando elimina per eliminarlo.";
        $scope.decisioneCreaNonPresaB = true;
        $scope.decisioneEliminaNonPresaB = false;
    };
    //function that has the duty to resent choose
    $scope.resetShow = function () {
        $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", nella sezione avvisi! Cosa vuoi fare?";
        $scope.decisioneCreaNonPresaB = true;
        $scope.decisioneEliminaNonPresaB = true;
    }
    //return booleans show function
    $scope.decisioneCreaNonPresa = function () {
        return $scope.decisioneCreaNonPresaB;
    }
    $scope.decisioneEliminaNonPresa = function () {
        return $scope.decisioneEliminaNonPresaB;
    }
    //Define function that create alert
    $scope.createAlert = function () {
        //function to send alerts to users
        $http({
            method: "POST",
            url: "http://localhost:3001/api/invio-avviso",
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'title': 'Avviso',
                'text': $scope.alert
            }
        }).then(function (response) {
            //if i'm here server response with bad error or not
            alert(response.data.message);
            //reload page
            $window.location.reload();
        });
    };
    //define function that delete alert
    $scope.deleteAlert = function (avviso) {
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/deleteAlert',
            data: {
                'token': curToken.value,
                'number': avviso.number
            }
        }).then(function (response) {
            if (response.data.success) {
                //success message
                alert(response.data.message)
                $window.location.reload();
            }
            else {
                //erroro message
                alert(response.data.message)
            }
        });
    }
    //boolean to show section advise
    $scope.showAlertsB = false;
    //defin function to get alert
    $scope.getAlerts = function () {
        $http({
            method: "GET",
            url: "http://localhost:3001/get-avvisi",
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
            }
        }).then(function (response) {
            //assign data from database to local variable
            $scope.alerts = response.data;
        });
    }
    //function to active alerts area
    $scope.showAlerts = function () {
        $scope.showAlertsB = !$scope.showAlertsB;
    }
    //define function that control if text area is null
    $scope.textAreaInvalida = function () {
        if ($scope.alert.length < 20) {
            return true;
        }
        else {
            return false;
        }
    };
});