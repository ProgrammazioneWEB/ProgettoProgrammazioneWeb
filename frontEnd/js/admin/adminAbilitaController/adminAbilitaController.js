//define module
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);

indexAdminApp.controller('adminAbilitaController', function ($scope) {
    //message
    $scope.message = "Benvenuto amministratore, da qui puoi abilitare o disabilitare un correntista. Cosa vuoi fare?";
    //booleans to check admin choose
    $scope.decisioneAbilitaNonPresaBooleano = true;
    $scope.decisioneDisabilitaNonPresaBooleano = true;

    //functions to check that admin doesn't click any button yet
    $scope.decisioneAbilitaNonPresa = function () {
        return $scope.decisioneAbilitaNonPresaBooleano;
    };
    $scope.decisioneDisabilitaNonPresa = function () {
        return $scope.decisioneDisabilitaNonPresaBooleano
    };

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
});