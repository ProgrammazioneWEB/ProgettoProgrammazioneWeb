//module for admin
var indexAdminApp = angular.module('indexAdminApp', ['ngRoute']);
//controller for admin
indexAdminApp.controller('adminHomeController', function ($scope, $http, $window, $localStorage) {
    //  Se il token è salvato in locale lo prelevo (sarà sempre salvato in locale dopo il login)
    if ($localStorage.XToken) {
        curToken = $localStorage.XToken;
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
    }
    //redirect to other page
    else
        $window.location.href = '../index.html';
});