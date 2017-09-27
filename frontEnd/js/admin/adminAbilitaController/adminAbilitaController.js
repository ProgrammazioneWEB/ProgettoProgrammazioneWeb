//define module
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);

//define adminAbilitaController
indexAdminApp.controller('adminAbilitaController', function ($scope, $http,$window) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui puoi abilitare o disabilitare un correntista. Cosa vuoi fare?";
    //booleans to check admin choose
    $scope.decisioneAbilitaNonPresaBooleano = true;
    $scope.decisioneDisabilitaNonPresaBooleano = true;
    //errors to show
    $scope.countNumberDaAbilitareErrors = { error: "" };
    $scope.countNumberDaDisabilitareErrors = { error: "" };
    //function to controll countNumber
    $scope.controlCountNumberAbilita = function () {
        if ($scope.countNumberDaAbilitare === undefined) {
            $scope.formAbilita.countNumberDaAbilitare.$invalid = true;
            $scope.countNumberDaAbilitareErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else {
            //save pin like string
            $scope.countNumberDaAbilitareString = $scope.countNumberDaAbilitare.toString();
            if ($scope.countNumberDaAbilitareString.length < 6) {
                $scope.formAbilita.countNumberDaAbilitare.$invalid = true;
                $scope.countNumberDaAbilitareErrors = {
                    error: "*Il pin è troppo corto"
                };
            }
            else if ($scope.countNumberDaAbilitareString.length > 6) {
                $scope.formAbilita.countNumberDaAbilitare.$invalid = true;
                $scope.countNumberDaAbilitareErrors = {
                    error: "*Il pin è troppo lungo"
                };
            }
            else {
                $scope.formAbilita.countNumberDaAbilitare.$invalid = false;
                $scope.countNumberDaAbilitareErrors = {
                    error: ""
                };
            }
        }

    }
    //function to controll countNumber
    $scope.controlCountNumberDisabilita = function () {
        if ($scope.countNumberDaDisabilitare === undefined) {
            $scope.formDisabilita.countNumberDaDisabilitare.$invalid = true;
            $scope.countNumberDaDisabilitareErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else {
            //save pin like string
            $scope.countNumberDaDisabilitareString = $scope.countNumberDaDisabilitare.toString();
            if ($scope.countNumberDaDisabilitareString.length < 6) {
                $scope.formDisabilita.countNumberDaDisabilitare.$invalid = true;
                $scope.countNumberDaDisabilitareErrors = {
                    error: "*Il pin è troppo corto"
                };
            }
            else if ($scope.countNumberDaDisabilitareString.length > 6) {
                $scope.formDisabilita.countNumberDaDisabilitare.$invalid = true;
                $scope.countNumberDaDisabilitareErrors = {
                    error: "*Il pin è troppo lungo"
                };
            }
            else {
                $scope.formDisabilita.countNumberDaDisabilitare.$invalid = false;
                $scope.countNumberDaDisabilitareErrors = {
                    error: ""
                };
            }
        }

    }
    //functions to check that admin doesn't click any button yet
    $scope.decisioneAbilitaNonPresa = function () {
        return $scope.decisioneAbilitaNonPresaBooleano;
    }

    $scope.decisioneDisabilitaNonPresa = function () {
        return $scope.decisioneDisabilitaNonPresaBooleano
    }
    //functions to change stages
    $scope.showAbilita = function () {
        $scope.decisioneAbilitaNonPresaBooleano = false;
        $scope.decisioneDisabilitaNonPresaBooleano = true;
    };
    //functions to change stages
    $scope.showDisabilita = function () {
        $scope.decisioneDisabilitaNonPresaBooleano = false;
        $scope.decisioneAbilitaNonPresaBooleano = true;
    };

    //function to reset admin choose
    $scope.resetShow = function () {
        $scope.decisioneAbilitaNonPresaBooleano = true;
        $scope.decisioneDisabilitaNonPresaBooleano = true;
    };
    //function to enable user
    $scope.enableUser = function () {
        //call the api
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/on',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumberDaAbilitare
            }
        }).then(function (response) {
            //in every case i print the return message
            alert(response.data.message);
            $window.location.reload();
        });
    }
    //function to disable user
    $scope.disableUser = function () {
        //call the api
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/off',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumberDaDisabilitare
            }
        }).then(function (response) {
            //in every case i print the return message
            alert(response.data.message);
            $window.location.reload();
        });
    }

});