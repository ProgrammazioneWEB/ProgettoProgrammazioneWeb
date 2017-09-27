//define module
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);
//controller for transaction
indexAdminApp.controller('adminBonificoController', function ($scope, $http, $window) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui potrai effettuare un bonifico tra due utenti, per accertarti che la somma del bonifico possa essere effettivamente pagata vai nella sezione" +
        "Visiona stato di un utente";
    //errors that could be thrown
    $scope.paymentErrors =
        {
            error: ""
        };
    $scope.countOrderErrors =
        {
            error: ""
        };
    $scope.countBenErrors =
        {
            error: ""
        };
    //function to controll countNumber
    $scope.controlCountNumberOrd = function () {
        if ($scope.countNumberOrd === undefined) {
            $scope.form.countNumberOrd.$invalid = true;
            $scope.countOrderErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else {
            //save pin like string
            $scope.countNumberOrdString = $scope.countNumberOrd.toString();
            if ($scope.countNumberOrdString.length < 6) {
                $scope.form.countNumberOrd.$invalid = true;
                $scope.countOrderErrors = {
                    error: "*Il pin è troppo corto"
                };
            }
            else if ($scope.countNumberOrdString.length > 6) {
                $scope.form.countNumberOrd.$invalid = true;
                $scope.countOrderErrors = {
                    error: "*Il pin è troppo lungo"
                };
            }
            else {
                $scope.form.countNumberOrd.$invalid = false;
                $scope.countOrderErrors = {
                    error: ""
                };
            }
        }
    }
    //function to controll countNumber
    $scope.controlCountNumberBen = function () {
        if ($scope.countNumberBen === undefined) {
            $scope.form.countNumberBen.$invalid = true;
            $scope.countBenErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else {
            //save pin like string
            $scope.countNumberBenString = $scope.countNumberBen.toString();
            if ($scope.countNumberBenString.length < 6) {
                $scope.form.countNumberBen.$invalid = true;
                $scope.countBenErrors = {
                    error: "*Il pin è troppo corto"
                };
            }
            else if ($scope.countNumberBenString.length > 6) {
                $scope.form.countNumberBen.$invalid = true;
                $scope.countBenErrors = {
                    error: "*Il pin è troppo lungo"
                };
            }
            else {
                $scope.form.countNumberBen.$invalid = false;
                $scope.countBenErrors = {
                    error: ""
                };
            }
        }
    }
    //function that control import
    $scope.checkImport = function () {
        if ($scope.payment == undefined) {
            //user didn't write nothing yet, it' not an error
            $scope.form.payment.$invalid = true;
            $scope.paymentErrors.error = "";
        }
        else if ($scope.payment < 50) {
            //error
            $scope.form.payment.$invalid = true;
            $scope.paymentErrors.error = "*Importo non sufficiente";
        }
        else {
            //ok
            $scope.form.payment.$invalid = false;
            $scope.paymentErrors.error = "";
        }
    };
    //function to make the transaction
    $scope.makeTransaction = function () {
        //call server api    
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/invio-bonifico-admin',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'from': $scope.countNumberOrd,
                'to': $scope.countNumberBen,
                'quantity': $scope.payment
            }
        }).then(function (response) {
            if (response.data.success) {
                //in case of success reload page
                alert(response.data.message);
                $window.location.reload();
            }
            else {
                //error
                alert(response.data.message)
            }

        });
    };
});