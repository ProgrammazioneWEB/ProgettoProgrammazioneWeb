// create the module for the indexUser
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs', 'ngStorage']);

// configuring routes
indexUserApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './html/user/userHome/userHome.html',
            controller: 'userHomeController'
        })
        .when('/average', {
            templateUrl: './html/user/userAverage/userAverage.html',
            controller: 'userAverageController'
        })
        .when('/movements', {
            templateUrl: './html/user/userMovements/userMovements.html',
            controller: 'userMovementsController'
        })
        .when('/transaction', {
            templateUrl: './html/user/userTransaction/userTransaction.html',
            controller: 'userTransactionController'
        })
        .when('/graph', {
            templateUrl: './html/user/userGraph/userGraph.html',
            controller: 'userGraphController'
        })
        .when('/mainHome', {
            templateUrl: './html/user/userHome/userHome.html',
            controller: 'changeSite'
        })
        .when('/modifyMeta', {
            templateUrl: './html/user/userModifyMeta/userModifyMeta.html',
            controller: 'userModifyMetaController'
        })
});

//  variabile contenente il token
var curToken = { value: "", enable: false };

//user dates
var userProfile = null;
//user movements
var userMovements = null;
//user alerts
var userAlerts = null;
//user home controller
/**
 * Dato che questo è il primo controller utilizzato richiamerò tutte le funzioni del server per salvare
 * tutte le informazioni dell'utente.
 */
indexUserApp.controller('userHomeController', function ($scope, $http, $window, $localStorage) {
    //  Se il token è salvato in locale lo prelevo (sarà sempre salvato in locale dopo il login)
    if ($localStorage.XToken) {
        curToken = $localStorage.XToken;
    }
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

});

//user movements controller
indexUserApp.controller('userMovementsController', function ($scope) {
    $scope.message = "Benvenuto nella pagina dei movimenti bancari";
    $scope.movimentiBancari = userMovements;
});


//controller that will change the page
indexUserApp.controller('changeSite', function ($scope, $window) {
    //parte per salvare il token
    $window.location.href = "../index.html";
});

//user movements controller
indexUserApp.controller('userTransactionController', function ($scope, $http, $window, $localStorage) {
    //iban filter 
    var ibanFilter = "";
    //ERRORS
    //errors that could be thrown
    $scope.paymentErrors =
        {
            error: ""
        };
    //errors that could be thrown
    $scope.ibanErrors =
        {
            error: ""
        };
    //message
    $scope.message = "Da qui puoi effettuare un bonifico";
    //functions that do the payment
    //functio to control if payment is acceptable
    $scope.controlPayment = function () {
        //cifra scritta dall'utente
        this.pagamento = Number($scope.payment);
        //limite minimo per effettuare un bonifico
        //limite massimo dato dai soldi che l'utente ha nel conto
        if (this.pagamento === undefined) {
            //error
            $scope.form.payment.$invalid = true;
            $scope.paymentErrors.error = "*Non hai scritto alcuna cifra!";
        }
        else if (this.pagamento < 50) {
            //error
            $scope.form.payment.$invalid = true;
            $scope.paymentErrors.error = "*Il minimo valore per effettuare un bonifico è di 50€";
        }
        else if (this.pagamento > userProfile.saldo) {
            //error
            $scope.form.payment.$invalid = true;
            $scope.paymentErrors.error = "*Non hai abbastanza disponibilità per effettuare questo bonifico";
        }
        else {
            //error
            $scope.form.payment.$invalid = false;
            $scope.paymentErrors.error = "";
            //do the payment
            this.user.saldo = this.user.saldo - payment;
        }
    };
    //function that control validity of iban
    $scope.controlIban = function () {
        if ($scope.iban == undefined) {
            //user didn't write nothing yet, it' not an error
            $scope.form.iban.$invalid = false;
            $scope.ibanErrors.error = "";
        }
        /**TO DEFINE AFTER CHOOSE THE FILTER 
        // alert(ibanFilter.test($scope.iban));
        else if (!(ibanFilter.test($scope.iban))) {
            //error
            //alert("iban scorretto");
            $scope.form.iban.$invalid = true;
            $scope.ibanErrors.error = "*Iban in formato errato";
        }*/
        else {
            //error
            //alert("iban corretto");              
            $scope.form.iban.$invalid = false;
            $scope.ibanErrors.error = "";
        }

    };
    //function that control if form is valid
    $scope.formNotValid = function () {
        if ($scope.form.$invalid ||
            $scope.form.iban.$invalid ||
            $scope.form.payment.$invalid) {
            return true;
        }
        else {
            return false;
        }
    }
    //payment done or not 
    $scope.controlIfTransaction = function () {
        if ($localStorage.BonificoEffettuatoOra == true) {
            $scope.message = "Hai effettuato un bonifico!";
            return true;
        }
        else
            return false;
    }
    //reset boolean transaction
    $scope.resetBoolean = function () {
        //cancello questo booleano
        $localStorage.BonificoEffettuatoOra = false;
        $scope.message = "Da qui puoi effettuare un bonifico";
    };
    //function to pay, that calls server apis
    $scope.pay = function () {
        $http({
            method: "POST",
            url: "http://localhost:3001/api/invio-bonifico-user",
            headers: { 'Content-Type': 'application/json' },
            data: {
                'email': $localStorage.Email,
                'token': curToken.value,
                'to': $scope.iban,
                'quantity': $scope.payment
            }
        }).then(function (response) {
            if (response.data.success) {
                alert(response.data.message);
                //boolean used to change content of page
                $localStorage.BonificoEffettuatoOra = true;
                $scope.message = "Hai effettuato un bonifico!";
                //refresho la pagina per prendere i risultati
                $window.location.reload();
            }
            else {
                alert(response.data.message);
            }
        });
    };
});

//user spent average controller
indexUserApp.controller('userAverageController', function ($scope) {
    //take the date of creatione of the count
    this.dateOfCreation = new Date(userProfile.dataCreazioneConto);
    //take the current day
    this.currentDay = Date.now();
    //differences between the two dates
    this.numberOfDays = this.currentDay - this.dateOfCreation.getDate();
    //take the sum of the passive
    this.sumOfPassive = 0;
    //define a function into the for each called on the movement's array to find the average of the spent
    //of the user for every day
    /** 
    userProfile.movimenti.forEach(function (movimento) {
        this.sumOfPassive += Number(movimento.spesa);
    }, this);*/
    //return the sum divided by the total of the days with some activity
    this.average = Math.round(this.sumOfPassive / this.numberOfDays).toFixed(2);
    $scope.message = "La tua spesa giornaliera media è di: " + this.average;
});

//user graph controller
indexUserApp.controller('userGraphController', function ($scope) {
    //GRAPH AREA
    //GRAPH VARIABLES 
    //Function to show graph
    //data of user entrance 
    $scope.userEntrance = [];
    $scope.message = "Benvenuto nella sezione dei grafici";

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

//modify meta controller
indexUserApp.controller('userModifyMetaController', function ($scope, $http, $window) {
    $scope.message="Benvenuto " + userProfile.meta.firstName +", da qui potrai modificare le tue credenziali!";
});






