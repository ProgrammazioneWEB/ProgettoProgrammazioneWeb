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
        .when("/newCount", {
            templateUrl: "/html/admin/adminRegistraUtente/adminRegistraUtente.html",
            controller: 'adminRegistraUtente'
        })
});
//admin Profile
var adminProfile = {};
//  variabile contenente il token
var curToken = { value: "", enable: false };
// Link heroku
var serverheroku = "https://bancaunicamserver.herokuapp.com/";
//controller for admin
indexAdminApp.controller('adminHomeController', function ($scope, $http, $window, $localStorage) {
    //  Se il token è salvato in locale lo prelevo (sarà sempre salvato in locale dopo il login)
    if ($localStorage.XToken) {
        curToken = $localStorage.XToken;
        //in sostanza ho appena fatto login!
            $http({
                method: "POST",
                url: serverheroku + "api/userData",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    'token': curToken.value
                }
            }).then(function (response) {
                if (response.data.success) {
                    adminProfile = response.data.result;
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
    //redirect to other page
    else
        $window.location.href = '../index.html';
});

//controller that will change the page
indexAdminApp.controller('changeSite', function ($scope, $window) {
    //parte per salvare il token
    $window.location.href = "../index.html";
});

//define alert controller
indexAdminApp.controller('adminAlertController', function ($scope, $http, $localStorage, $window,$filter) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", nella sezione avvisi! Cosa vuoi fare?";
    //alert to create
    $scope.alert = "";
    //alert getted
    $scope.alerts = {};
    //booleans that have the function to show respectively
    $scope.decisioneCreaNonPresaB = true;
    $scope.decisioneEliminaNonPresaB = true;
    //functions that have the duty of showing section
    $scope.showCrea = function () {
        $scope.message = "Da qui potrai scrivere un avviso da inviare a tutti coloro che" +
            "posseggono un conto Bancario presso la nostra Banca." +
            "Ricorda che l'avviso dovrà avere almeno 20 caratteri!";
        $scope.decisioneCreaNonPresaB = false;
        $scope.decisioneEliminaNonPresaB = true;
    };
    $scope.showElimina = function () {
        $scope.message = "Da qui potrai eliminare un avviso. Scegli un avviso tra quelli creati e" +
            "seleziona il comando elimina per eliminarlo.";
        $scope.decisioneCreaNonPresaB = true;
        $scope.decisioneEliminaNonPresaB = false;
    };
    //function that has the duty to resent choose
    $scope.resetShow = function () {
        $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", nella sezione avvisi! Cosa vuoi fare?";
        $scope.decisioneCreaNonPresaB = true;
        $scope.decisioneEliminaNonPresaB = true;
    }
    //return booleans show function
    $scope.decisioneCreaNonPresa = function () {
        return $scope.decisioneCreaNonPresaB;
    }
    $scope.decisioneEliminaNonPresa = function () {
        return $scope.decisioneEliminaNonPresaB;
    }
    //Define function that create alert
    $scope.createAlert = function () {
        //function to send alerts to users
        $http({
            method: "POST",
            url: serverheroku + "api/invio-avviso",
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
            $window.location.href = "../indexAdmin.html";
        });
    };
    //define function that delete alert
    $scope.deleteAlert = function (avviso) {
        $http({
            method: 'POST',
            url: serverheroku + 'api/deleteAlert',
            data: {
                'token': curToken.value,
                'number': avviso.number
            }
        }).then(function (response) {
            if (response.data.success) {
                //success message
                alert(response.data.message)
                $window.location.href = "../indexAdmin.html";
            }
            else {
                //erroro message
                alert(response.data.message)
            }
        });
    }
    //boolean to show section advise
    $scope.showAlertsB = false;
    //defin function to get alert
    $scope.getAlerts = function () {
        $http({
            method: "GET",
            url: serverheroku + "get-avvisi",
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
            url: serverheroku + 'api/invio-bonifico-admin',
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
                $window.location.href = "../indexAdmin.html";
            }
            else {
                //error
                alert(response.data.message)
            }

        });
    };
});

//define userVisionController
indexAdminApp.controller('adminUserVisionController', function ($scope, $http) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui potrai controllare lo stato di un correntista";
    //count number insert by admin
    $scope.countNumber = undefined;
    //errors to show
    $scope.countNumberErrors = { error: "" };
    //user data
    $scope.userData = null;
    //function to controll countNumber
    $scope.controlCountNumber = function () {
        //save pin like string
        $scope.countNumberString = $scope.countNumber.toString();
        if ($scope.countNumber === undefined) {
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
    //function to get userData from server
    $scope.getUserData = function () {
        //get user data from server
        $http({
            method: 'POST',
            url: serverheroku + 'api/userDataNAccount',
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
                $scope.userDateOfCreation =$scope.userData.dateOfCreation;
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
indexAdminApp.controller('adminAbilitaController', function ($scope, $http,$window) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui puoi abilitare o disabilitare un correntista. Cosa vuoi fare?";
    //booleans to check admin choose
    $scope.decisioneAbilitaNonPresaBooleano = true;
    $scope.decisioneDisabilitaNonPresaBooleano = true;
    //errors to show
    $scope.countNumberDaAbilitareErrors = { error: "" };
    $scope.countNumberDaDisabilitareErrors = { error: "" };
    //function to controll countNumber
    $scope.controlCountNumberAbilita = function () {
        if ($scope.countNumberDaAbilitare === undefined) {
            $scope.formAbilita.countNumberDaAbilitare.$invalid = true;
            $scope.countNumberDaAbilitareErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else {
            //save pin like string
            $scope.countNumberDaAbilitareString = $scope.countNumberDaAbilitare.toString();
            if ($scope.countNumberDaAbilitareString.length < 6) {
                $scope.formAbilita.countNumberDaAbilitare.$invalid = true;
                $scope.countNumberDaAbilitareErrors = {
                    error: "*Il pin è troppo corto"
                };
            }
            else if ($scope.countNumberDaAbilitareString.length > 6) {
                $scope.formAbilita.countNumberDaAbilitare.$invalid = true;
                $scope.countNumberDaAbilitareErrors = {
                    error: "*Il pin è troppo lungo"
                };
            }
            else {
                $scope.formAbilita.countNumberDaAbilitare.$invalid = false;
                $scope.countNumberDaAbilitareErrors = {
                    error: ""
                };
            }
        }

    }
    //function to controll countNumber
    $scope.controlCountNumberDisabilita = function () {
        if ($scope.countNumberDaDisabilitare === undefined) {
            $scope.formDisabilita.countNumberDaDisabilitare.$invalid = true;
            $scope.countNumberDaDisabilitareErrors = {
                error: "*Non hai scritto il pin"
            };
        }
        else {
            //save pin like string
            $scope.countNumberDaDisabilitareString = $scope.countNumberDaDisabilitare.toString();
            if ($scope.countNumberDaDisabilitareString.length < 6) {
                $scope.formDisabilita.countNumberDaDisabilitare.$invalid = true;
                $scope.countNumberDaDisabilitareErrors = {
                    error: "*Il pin è troppo corto"
                };
            }
            else if ($scope.countNumberDaDisabilitareString.length > 6) {
                $scope.formDisabilita.countNumberDaDisabilitare.$invalid = true;
                $scope.countNumberDaDisabilitareErrors = {
                    error: "*Il pin è troppo lungo"
                };
            }
            else {
                $scope.formDisabilita.countNumberDaDisabilitare.$invalid = false;
                $scope.countNumberDaDisabilitareErrors = {
                    error: ""
                };
            }
        }

    }
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
            url: serverheroku + 'api/on',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumberDaAbilitare
            }
        }).then(function (response) {
            //in every case i print the return message
            alert(response.data.message);
            $window.location.href = "../indexAdmin.html";
        });
    }
    //function to disable user
    $scope.disableUser = function () {
        //call the api
        $http({
            method: 'POST',
            url: serverheroku + 'api/off',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'n_account': $scope.countNumberDaDisabilitare
            }
        }).then(function (response) {
            //in every case i print the return message
            alert(response.data.message);
            $window.location.href = "../indexAdmin.html";
        });
    }

});

//Define adminRegistraUtente
indexAdminApp.controller('adminRegistraUtente', function ($scope, $http, $window) {
    //message
    $scope.message = "Benvenuto " + adminProfile.meta.firstName + ", da qui potrai creare un nuovo conto corrente.Per crearlo" +
        " ti basterà inserire il nuovo numero di conto del cliente, assieme al pin per registrare il conto home banking e "
        + " la cifra iniziale versata dal cliente";
    //field to compile 
    $scope.pin = "";
    $scope.money = "";
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.dateOfBirth = "";
    $scope.numberOfPhone = "";
    $scope.residence = "";
    $scope.fiscalCode = "";
    //pin errors    
    $scope.pinErrors = { error: "" };
    //function to control pin
    $scope.checkPin = function () {
        if ($scope.pin === "" || $scope.pin === undefined) {
            $scope.form.pin.$invalid = true;
            $scope.pinErrors = { error: "Non hai scritto il pin!" };
        }
        else {
            $scope.pinString = $scope.pin.toString();
            if ($scope.pinString.length != 5) {
                $scope.form.pin.$invalid = true;
                $scope.pinErrors = { error: "Il pin deve essere lungo 5 cifre" };
            }
        }
    };
    //function to control if fields are correct
    $scope.checkForm = function () {
        if ($scope.pin == "" || $scope.money == "" || $scope.firstName == "" ||
            $scope.lastName == "" || $scope.dateOfBirth == "" || $scope.numberOfPhone == ""
            || $scope.residence == "" || $scope.fiscalCode == "")
            return true;
        else
            return false;
    }
    //function to register account
    $scope.registerUser = function () {
        $http({
            method: 'POST',
            url: serverheroku + 'api/InserisciPin-admin',
            headers: { 'Content-Type': 'application/json' },
            data: {
                'token': curToken.value,
                'pin': $scope.pin,
                'firstName': $scope.firstName,
                'lastName': $scope.lastName,
                'dateOfBirth': $scope.dateOfBirth,
                'numberOfPhone': $scope.numberOfPhone,
                'residence': $scope.residence,
                'fiscalCode': $scope.fiscalCode,
                'quantity': $scope.money,
            }
        }).then(function (response) {
            if (response.data.success) {
                alert(response.data.message);
                $window.location.href = "../indexAdmin.html";
            }
            else {
                alert("Errore nel server o nel db");
            }
        });
    }
});

