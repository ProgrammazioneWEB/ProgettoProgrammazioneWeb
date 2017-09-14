//module for admin
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute', 'ngStorage']);
//route for admin
indexAdminApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/html/admin/adminHome/adminHome.html",
            controller: "adminHomeController"
        })
        .when("/alert", {
            templateUrl: "/html/admin/adminAlert/adminAlert.html",
            controller: "adminAlertController"
        })
        .when("/transaction", {
            templateUrl: "/html/admin/adminBonifico/adminBonifico.html",
            controller: "adminBonificoController"
        })
        .when("/userStats", {
            templateUrl: "/html/admin/adminUserVision/adminUserVision.html",
            controller: "adminUserVisionController"
        })
        .when("/activeUser", {
            templateUrl: "/html/admin/adminAbilita/adminAbilita.html",
            controller: "adminAbilitaController"
        })
        .when("/mainHome", {
            templateUrl: "/html/admin/adminHome/adminHome.html",
            controller: 'changeSite'
        })
});
//admin Profile
var adminProfile = {};
//  variabile contenente il token
var curToken = { value: "", enable: false };

//controller for admin
indexAdminApp.controller('adminHomeController', function ($scope, $http, $window, $localStorage) {
    //  Se il token è salvato in locale lo prelevo (sarà sempre salvato in locale dopo il login)
    if ($localStorage.XToken) {
        curToken = $localStorage.XToken;
    }
    //se i dati dell'utente sono già salvati li prelevo
    if ($localStorage.adminProfile) {
        adminProfile = $localStorage.adminProfile;
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
                adminProfile = response.data.result;
                $localStorage.adminProfile = adminProfile;
                //profile area
                $scope.name = adminProfile.meta.firstName;
                $scope.surname = adminProfile.meta.lastName;
                /**
                   * This path it's useless at this level of file, but this path will be used in indexUser.html
                   * which is at the right level 
                   */
                $scope.userImagePath = adminProfile.image;
                //stats area
                //save the variabile to show the real countNumber
                $scope.idNumber = adminProfile.numberOfAccount;
            }
            else {
                alert("Nessun utente trovato! ");
                $window.location.href = "../index.html";
            }

        });
    }
});

//controller that will change the page
indexAdminApp.controller('changeSite', function ($scope, $window) {
    //parte per salvare il token
    $window.location.href = "../index.html";
});

//define alert controller
indexAdminApp.controller('adminAlertController', function ($scope, $http, $localStorage) {
    //message
    $scope.message = "Benvenuto, da qui potrai scrivere un avviso da inviare a tutti coloro che posseggono un conto Bancario presso la nostra Banca.Ricorda che l'avviso dovrà avere almeno 20 caratteri!";
    //alert to create
    $scope.alert = "";
    //Define function that create alert
    $scope.createAlert = function () {
        //function to send alerts to users
        $http({
            method: "POST",
            url: "http://localhost:3001/invio-avviso",
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'title': 'Avviso',
                'text': $scope.alert
            }
        }).then(function (response) {
            alert(response.data);
        });
    };
    //define function that control if text area is null
    $scope.textAreaInvalida = function () {
        if ($scope.alert.length < 20) {
            return true;
        }
        else {
            return false;
        }
    };
});

//controller for transaction
indexAdminApp.controller('adminBonificoController', function ($scope) {
    //message
    $scope.message = "Benvenuto admin, da qui potrai effettuare un bonifico tra due utenti, per accertarti che la somma del bonifico possa essere effettivamente pagata vai nella sezione" +
        "Visiona stato di un utente";
    //ItalianIbanFilter
    var ibanFilter = /^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/;
    //errors that could be thrown
    $scope.ibanOrdErrors =
        {
            error: ""
        };
    //errors that could be thrown
    $scope.ibanBenErrors =
        {
            error: ""
        };
    //errors that could be thrown
    $scope.paymentErrors =
        {
            error: ""
        };

    //function that control validity of iban
    $scope.controlIbanOrd = function () {
        console.log("sonoqui");
        if ($scope.ibanOrd == undefined) {
            //user didn't write nothing yet, it' not an error
            $scope.form.ibanOrd.$invalid = false;
            $scope.ibanOrdErrors.error = "";
        }
        // alert(ibanFilter.test($scope.iban));
        else if (!(ibanFilter.test($scope.ibanOrd))) {
            //error
            //alert("iban scorretto");
            $scope.form.ibanOrd.$invalid = true;
            $scope.ibanOrdErrors.error = "*Iban in formato errato";
        }
        else {
            //error
            //alert("iban corretto");             
            $scope.form.ibanOrd.$invalid = false;
            $scope.ibanOrdErrors.error = "";
        }

    };

    //function that control validity of iban
    $scope.controlIbanBen = function () {
        if ($scope.ibanBen == undefined) {
            //user didn't write nothing yet, it' not an error
            $scope.form.ibanBen.$invalid = false;
            $scope.ibanBenErrors.error = "";
        }
        // alert(ibanFilter.test($scope.iban));
        else if (!(ibanFilter.test($scope.ibanBen))) {
            //error
            //alert("iban scorretto");
            $scope.form.ibanBen.$invalid = true;
            $scope.ibanBenErrors.error = "*Iban in formato errato";
        }
        else {
            //error
            //alert("iban corretto");             
            $scope.form.ibanBen.$invalid = false;
            $scope.ibanBenErrors.error = "";
        }

    };

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
        //function to make the transaction
        $scope.makeTransaction = function () {
            var transaction = {
                ordinante: $scope.ibanOrd,
                beneficiario: $scope.ibanBen,
                importo: $scope.importo
            }
        };
    };
});


//define userVisionController
indexAdminApp.controller('adminUserVisionController', function ($scope) {
    //message
    $scope.message = "Benvenuto admin, da qui potrai controllare lo stato di un correntista";
    //count number insert by admin
    $scope.countNumber;
    //user data
    $scope.userData = null;
    //function to get userData from server
    $scope.getUserData = function () {
        //request http get with countNumber
        $scope.userData = {
            name: "Lorenzo",
            surname: "Stacchio",
            saldo: 50
        }
        //change message
        $scope.message = "Ecco qui i dati di" + userData.name + " " + userData.surname;
    };

    //function to check if user data were gotten or not 
    $scope.informazioniUserVuote = function () {
        if ($scope.userData === null) {
            return true;
        }
        else {
            return false;
        }
    };

    //function to resetUserSearch
    $scope.resetUser = function () {
        //change message
        $scope.userData = null;
        $scope.message = "Benvenuto admin, da qui potrai controllare lo stato di un correntista";
    }

});

indexAdminApp.controller('adminAbilitaController', function ($scope) {
    //message
    $scope.message = "Benvenuto amministratore, da qui puoi abilitare o disabilitare un correntista. Cosa vuoi fare?";
    //booleans to check admin choose
    $scope.decisioneAbilitaNonPresaBooleano = true;
    $scope.decisioneDisabilitaNonPresaBooleano = true;

    //functions to check that admin doesn't click any button yet
    $scope.decisioneAbilitaNonPresa = function () {
        return $scope.decisioneAbilitaNonPresaBooleano;
    }

    $scope.decisioneDisabilitaNonPresa = function () {
        return $scope.decisioneDisabilitaNonPresaBooleano
    }
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

