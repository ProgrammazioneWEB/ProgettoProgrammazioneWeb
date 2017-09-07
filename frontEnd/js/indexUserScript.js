// create the module for the indexUser
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);

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
});

//user dates
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

//user home controller
indexUserApp.controller('userHomeController', function ($scope) {
    $scope.message = "Benvenuto nel tuo profilo privato!";
    //profile area
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

//user movements controller
indexUserApp.controller('userMovementsController', function ($scope) {
    $scope.message = "Benvenuto nella pagina dei movimenti bancari";
    $scope.movimentiBancari = userProfile.movimenti;
});


//user movements controller
indexUserApp.controller('userTransactionController', function ($scope) {
    //iban filter 
    var ibanFilter = /^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/;
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
    $scope.message = "Da qui puoi effettuare un bonifico";
    //functions that do the payment
    //functio to control if payment is acceptable
    $scope.controlPayment = function () {
        //cifra scritta dall'utente
        this.pagamento = Number($scope.payment);
        //limite minimo per effettuare un bonifico
        //limite massimo dato dai soldi che l'utente ha nel conto
        if (this.pagamento < 50) {
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
        // alert(ibanFilter.test($scope.iban));
        else if (!(ibanFilter.test($scope.iban))) {
            //error
            //alert("iban scorretto");
            $scope.form.iban.$invalid = true;
            $scope.ibanErrors.error = "*Iban in formato errato";
        }
        else {
            //error
            //alert("iban corretto");             
            $scope.form.iban.$invalid = false;
            $scope.ibanErrors.error = "";
        }

    };
});