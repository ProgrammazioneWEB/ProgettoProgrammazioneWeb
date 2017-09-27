//index
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);


/**
 * Dato che questo è il primo controller utilizzato richiamerò tutte le funzioni del server per salvare
 * tutte le informazioni dell'utente.
 */
indexUserApp.controller('userHomeController', function ($scope, $http, $window, $localStorage) {
    //  Se il token è salvato in locale lo prelevo (sarà sempre salvato in locale dopo il login)
    if ($localStorage.XToken) {
        curToken = $localStorage.XToken;
        //se i dati dell'utente sono già salvati li prelevo
        if ($localStorage.userProfile) {
            userProfile = $localStorage.userProfile;
        }
        //se i dati sui movimenti dell'utente sono già salvati li prelevo
        if ($localStorage.userMovements) {
            userMovements = $localStorage.userMovements;
        }
        //  Tutti i dati sottostanti vanno richiesti al server di node (bisogna passargli l'email)
        //in sostanza ho appena fatto login!
        if ($localStorage.Email) {
            $http({
                method: "POST",
                url: "http://localhost:3001/api/userData",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    'email': $localStorage.Email,
                    'token': curToken.value
                }
            }).then(function (response) {
                if (response.data.success) {
                    userProfile = response.data.result;
                    $localStorage.userProfile = userProfile;
                    //assign datas
                    $scope.message = "Benvenuto nel tuo profilo privato!";
                    //profile area
                    $scope.username = userProfile.meta.firstName + " " + userProfile.meta.lastName;
                    /**
                       * This path it's useless at this level of file, but this path will be used in indexUser.html
                       * which is at the right level 
                       */
                    $scope.userImagePath = userProfile.image;
                    //control user image path, if string contains nothing replace it 
                    if ($scope.userImagePath == "") {
                        //give a default image
                        $scope.userImagePath = "../CSS/images/iconsForUser/user_default.jpg"
                    }
                    //stats area
                    //save the variable to show the real saldo
                    $scope.moneyMessage = userProfile.availableBalance + " €";
                    //save the variabile to show the real countNumber
                    $scope.countNumber = userProfile.numberOfAccount;
                }
                else {
                    alert("Nessun utente trovato! ");
                    $window.location.href = "../index.html";
                }

            });
            //se sono qui l'utente è loggato richiamo varie funzioni
            //prendo i movimenti bancari
            $http({
                method: "POST",
                url: "http://localhost:3001/api/movements",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    'token': curToken.value
                }
            }).then(function (response) {
                if (response.data.success) {
                    userMovements = response.data.result;
                    $localStorage.userMovements = userMovements;
                }
                else {
                    alert("Nessun Movimento trovato");
                }

            });
            //define booleans to show alerts if exists
            $scope.existOneAlert = false;
            $scope.showAlertCall = false;
            //define local alerts
            $scope.alerts = [];
            //take alerts from database
            $http({
                method: "GET",
                url: "http://localhost:3001/get-avvisi",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    'token': curToken.value,
                }
            }).then(function (response) {
                //get alerts object
                userAlerts = response.data;
                //control if exist one alert 
                if (userAlerts.length != 0) {
                    $scope.existOneAlert = true;
                    $scope.alerts = userAlerts;
                }
            });
            //define function to show alert
            $scope.showAlert = function () {
                $scope.showAlertCall = !$scope.showAlertCall;
            }
        }
    }
    else
    $window.location.href = '../index.html';

});
