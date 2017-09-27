// create the module for the indexUser
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch',
'zingchart-angularjs', 'ngStorage',]);


//user spent average controller
indexUserApp.controller('userAverageController', function ($scope, $http) {
    $scope.message = "Statistiche giornaliere";
    //DEFINE AVERAGE variables
    $scope.averageExpence = 0;
    $scope.averageEntrance = 0;
    //take the average of spent and entrance
    $http({
        method: 'POST',
        url: 'http://localhost:3001/api/CalcolaMediaUscite',
        headers: { 'Content-Type': 'application/json' },
        data: {
            'token': curToken.value,
            'numberOfAccount': userProfile.numberOfAccount
        }
    }).then(function (response) {
        if (response.data.success) {
            $scope.averageExpence = response.data.data;
        }
        else {
            alert(response.data.message);
        }
    });

    $http({
        method: 'POST',
        url: 'http://localhost:3001/api/CalcolaMediaEntrate',
        headers: { 'Content-Type': 'application/json' },
        data: {
            'token': curToken.value,
            'numberOfAccount': userProfile.numberOfAccount
        }
    }).then(function (response) {
        if (response.data.success) {
            $scope.averageEntrance = response.data.data;
        }
        else {
            alert(response.data.message);
        }
    });


});