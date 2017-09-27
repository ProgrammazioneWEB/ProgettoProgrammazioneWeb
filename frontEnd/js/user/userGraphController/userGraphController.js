// create the module for the indexUser
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);

//user graph controller
indexUserApp.controller('userGraphController', function ($scope) {
    //GRAPH AREA
    //GRAPH VARIABLES 
    //Function to show graph
    //data of user entrance 
    $scope.userEntrance = [];
    $scope.message = "Sezione grafici";

    //ENTRANCE GRAPH
    //boolean to show entrace graph
    $scope.entranceBGraphClicked = false;
    $scope.versusBGraphClicked = false;
    $scope.exitBGraphClicked = true;

    //Function to show activeEntranceGraph
    $scope.activeEntranceGraph = function () {
        for (i = 0; i < userMovements.length; i++) {
            $scope.userEntrance[i] = userMovements[i].entrata;
        }
        $scope.exitBGraphClicked = false;
        $scope.versusBGraphClicked = false;
        $scope.entranceBGraphClicked = true;
    };
    //define title of entrance graph
    $scope.JsonGraphEntrance = {
        type: 'line',
        legend: {
        },
        plot: {
            animation: {
                effect: "ANIMATION_FADE_IN",
                speed: 3000
            }
        },
        title: {
            text: "Entrance"
        },
        series: [
            {
                lineColor: "#27C322",
                values: $scope.userEntrance,
                text: "Entrance"
            }
        ]
    }
    //EXIT GRAPH
    //boolean to show exit graph
    //data of user exit 
    $scope.userExit = [];
    $scope.exitBGraphClicked = false;
    //Function to show activeExitGraph
    $scope.activeExitGraph = function () {
        for (i = 0; i < userMovements.length; i++) {
            $scope.userExit[i] = userMovements[i].uscita;
        }
        $scope.entranceBGraphClicked = false;
        $scope.versusBGraphClicked = false;
        $scope.exitBGraphClicked = true;

    };
    //define title of exit graph
    $scope.JsonGraphExit = {
        type: 'line',
        legend: {
        },
        plot: {
            animation: {
                effect: "ANIMATION_FADE_IN",
                speed: 3000
            }
        },
        title: {
            text: "Exit"
        },
        series: [
            {
                lineColor: "#CD1622",
                values: $scope.userExit,
                text: "Exit"
            }
        ]
    }


    //VERSUS GRAPH
    //boolean to show versus graph
    $scope.versusBGraphClicked = false;
    //Function to show activeExitGraph
    $scope.activeVersusGraph = function () {
        for (i = 0; i < userMovements.length; i++) {
            $scope.userEntrance[i] = userMovements[i].entrata;
            $scope.userExit[i] = userMovements[i].uscita;
        }
        $scope.entranceBGraphClicked = false;
        $scope.exitBGraphClicked = false;
        $scope.versusBGraphClicked = true;
    };
    //define title of versus graph
    $scope.JsonGraphVersus = {
        type: 'line',
        legend: {
        },
        plot: {
            animation: {
                effect: "ANIMATION_FADE_IN",
                speed: 3000
            }
        },
        title: {
            text: "Versus Graph"
        },
        series: [
            {
                lineColor: "#27C322",
                values: $scope.userEntrance,
                text: "Entrance"
            },
            {
                lineColor: "#CD1622",
                values: $scope.userExit,
                text: "Exit"
            }
        ]
    }
});