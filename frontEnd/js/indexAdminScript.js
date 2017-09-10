//module for admin
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);

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
});

//global variable of admin data
var adminProfile = {
    name: "Lorenzo",
    surname: "Stacchio",
    idNumber: "124356",
    imagePath: "/CSS/images/Fondatori/Ls.png",
};

//controller for admin
indexAdminApp.controller('adminHomeController', function ($scope) {
    //admin image path
    $scope.adminImagePath = adminProfile.imagePath;
    //name and surname
    $scope.name = adminProfile.name;
    $scope.surname = adminProfile.surname;
    $scope.idNumber = adminProfile.idNumber;

});

//controller for admin
indexAdminApp.controller('changeSite', function ($window) {
    //admin image path
    $window.location.href = "../index.html";

});


//define alert controller
indexAdminApp.controller('adminAlertController', function ($scope) {
    //message
    $scope.message = "Benvenuto, da qui potrai scrivere un avviso da inviare a tutti coloro che posseggono un conto Bancario presso la nostra Banca.Ricorda che l'avviso dovrà avere almeno 20 caratteri!";
    //alert to create
    $scope.alert = "";
    //Define function that create alert
    $scope.createAlert = function () {
        var alert = {
            alert: $scope.alert
        };
    };
    //define function that control if text area is null
    $scope.textAreaInvalida = function () {
        console.log($scope.alert.length);
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

};

    
});