//define model
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);


//define alert controller
indexAdminApp.controller('adminAlertController', function ($scope) {

    //alert to create
    $scope.alert = "";

    //Define function that create alert
    $scope.createAlert = function () {
        var alert = {
            alert: $scope.alert
        };
        alert(alert);
    };
});