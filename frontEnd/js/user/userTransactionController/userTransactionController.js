// create the module for the indexUser
var indexUserApp = angular.module('indexUserApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);

//user movements controller
indexUserApp.controller('userTransactionController', function ($scope, $http, $window, $localStorage) {
    //ERRORS
    //errors that could be thrown
    $scope.paymentErrors =
        {
            error: ""
        };
    //errors that could be thrown
    $scope.countNumberErrors =
        {
            error: ""
        };
    //message
    $scope.message = "Sezione bonifico";
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
    //function to controll countNumber
    $scope.controlCountNumber = function () {
        //save pin like string
        $scope.countNumberString = $scope.countNumber.toString();
        if ($scope.countNumber === undefined || $scope.countNumber == "") {
            $scope.form.countNumber.$invalid = true;
            $scope.countNumberErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else if ($scope.countNumberString.length < 6) {
            $scope.form.countNumber.$invalid = true;
            $scope.countNumberErrors = {
                error: "*Il pin è troppo corto"
            };
        }
        else if ($scope.countNumberString.length > 6) {
            $scope.form.countNumber.$invalid = true;
            $scope.countNumberErrors = {
                error: "*Il pin è troppo lungo"
            };
        }
        else {
            $scope.form.countNumber.$invalid = false;
            $scope.countNumberErrors = {
                error: ""
            };
        }

    };
    //function that control if form is valid
    $scope.formNotValid = function () {
        if ($scope.form.$invalid ||
            $scope.form.countNumber.$invalid ||
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
                'token': curToken.value,
                'to': $scope.countNumber,
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