//index
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);


//user home controller
indexUserApp.controller('userHomeController', function ($scope) {
    $scope.message = "Benvenuto nel tuo profilo privato!";
    //profile area
    //json object of user profile
    var userProfile = {
        username: "Lorenzo Stacchio",
        saldo: 50,
        countNumber: 15268151,
        dataCreazioneConto: "10/5/2017",
        movimenti: [
            {
                data: "12/05/2017",
                spesa: 0,
                entrata: 0,
            },
            {
                data: "5/05/2017",
                spesa: -20,
                entrata: 10,
            },
            {
                data: "20/07/2017",
                spesa: -30,
                entrata: 40,
            },
            {
                data: "12/05/2017",
                spesa: -10,
                entrata: 50,
            },
            {
                data: "5/05/2017",
                spesa: 0,
                entrata: 30,
            },
            {
                data: "12/05/2017",
                spesa: 0,
                entrata: 0,
            },
            {
                data: "5/05/2017",
                spesa: -20,
                entrata: 10,
            },
            {
                data: "20/07/2017",
                spesa: -30,
                entrata: 40,
            },
            {
                data: "12/05/2017",
                spesa: -10,
                entrata: 50,
            },
            {
                data: "5/05/2017",
                spesa: 0,
                entrata: 30,
            }
        ]
    };
    $scope.username = userProfile.username;
    /**
       * This path it's useless at this level of file, but this path will be used in indexUser.html
       * which is at the right level 
       */
    $scope.userImagePath = "../../CSS/images/Fondatori/Ls.png";
    //stats area
    //save the variable to show the real saldo
    $scope.moneyMessage = userProfile.saldo + " €";
    //save the variabile to show the real countNumber
    $scope.countNumber = userProfile.countNumber;
});
