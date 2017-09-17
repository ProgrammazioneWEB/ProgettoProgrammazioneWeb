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
                $scope.adminImagePath = adminProfile.image;
                //control user image path
                if ($scope.adminImagePath == "") {
                    //give a default image
                    $scope.adminImagePath = "../CSS/images/iconsForAdmin/admin_default.jpg"
                }
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
indexAdminApp.controller('adminAlertController', function ($scope, $http, $localStorage, $window) {
    //message
    $scope.message = "Benvenuto, da qui potrai scrivere un avviso da inviare a tutti coloro che posseggono un conto Bancario presso la nostra Banca.Ricorda che l'avviso dovrà avere almeno 20 caratteri!";
    //alert to create
    $scope.alert = "";
    //alert getted
    $scope.alerts = {};
    //Define function that create alert
    $scope.createAlert = function () {
        //function to send alerts to users
        $http({
            method: "POST",
            url: "http://localhost:3001/api/invio-avviso",
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'title': 'Avviso',
                'text': $scope.alert
            }
        }).then(function (response) {
            //if i'm here server response with bad error or not
            alert(response.data.message);
            //reload page
            $window.location.reload();
        });
    };
    //boolean to show section advise
    $scope.showAlertsB = false;
    //defin function to get alert
    $scope.getAlerts = function () {
        $http({
            method: "GET",
            url: "http://localhost:3001/get-avvisi",
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
            }
        }).then(function (response) {
            //assign data from database to local variable
            $scope.alerts = response.data;
        });
    }
    //function to active alerts area
    $scope.showAlerts = function () {
        $scope.showAlertsB = !$scope.showAlertsB;
    }
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
indexAdminApp.controller('adminBonificoController', function ($scope, $http, $window) {
    //message
    $scope.message = "Benvenuto admin, da qui potrai effettuare un bonifico tra due utenti, per accertarti che la somma del bonifico possa essere effettivamente pagata vai nella sezione" +
        "Visiona stato di un utente";
    //errors that could be thrown
    $scope.paymentErrors =
        {
            error: ""
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
            else{
                //error
                alert(response.data.message)
            }

        });
    };
});


//define userVisionController
indexAdminApp.controller('adminUserVisionController', function ($scope, $http) {
    //message
    $scope.message = "Benvenuto admin, da qui potrai controllare lo stato di un correntista";
    //count number insert by admin
    $scope.countNumber;
    //user data
    $scope.userData = null;
    //function to get userData from server
    $scope.getUserData = function () {
        //get user data from server
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/userDataNAccount',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumber
            }
        }).then(function (response) {
            //if succes
            if (response.data.success) {
                $scope.userData = response.data.result;
                //change message
                $scope.message = "Dati del correntista " + $scope.userData.numberOfAccount;
                //define some local variable
                $scope.userName = $scope.userData.meta.firstName;
                $scope.userSurname = $scope.userData.meta.lastName;
                $scope.userEmail = $scope.userData.email;
                $scope.userMoney = $scope.userData.availableBalance + " €";
                $scope.userResidence = $scope.userData.meta.residence;
                $scope.userPhoneNumber = $scope.userData.meta.numberOfPhone;
                $scope.userEnable = $scope.userData.active;
                //control user image path, if string contains nothing replace it 
                if ($scope.userData.image == "") {
                    //give a default image
                    $scope.userImagePath = "../CSS/images/iconsForUser/user_default.jpg";
                }
                else
                    $scope.userImagePath = $scope.userData.image;
            }
            else {
                alert("Non esiste un correntista con questo numero di conto");
            }
        });
    };

    //function to check if user data were gotten or not 
    $scope.informazioniUserVuote = function () {
        if ($scope.userData == null) {
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
//define adminAbilitaController
indexAdminApp.controller('adminAbilitaController', function ($scope, $http) {
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
    //function to enable user
    $scope.enableUser = function () {
        //call the api
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/on',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumberDaAbilitare
            }
        }).then(function (response) {
            //in every case i print the return message
            alert(response.data.message);
        });
    }
    //function to disable user
    $scope.disableUser = function () {
        //call the api
        $http({
            method: 'POST',
            url: 'http://localhost:3001/api/off',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumberDaDisabilitare
            }
        }).then(function (response) {
            //in every case i print the return message
            alert(response.data.message);
        });
    }

});

