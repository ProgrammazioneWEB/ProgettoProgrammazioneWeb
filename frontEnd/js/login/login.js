var indexApp = angular.module('indexApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs', 'ngStorage', 'ngFileUpload']);


/**
 * Username is the e-mail of the persone who want to access in it's personal profile
 */
indexApp.controller('gestisciLogin', function ($scope, $http, $location, $window, $localStorage) {
  //messaggio di entrata
  $scope.message = "Login page";
  //errori rilevabili nei campi
  $scope.usernameError = { username: "" };
  $scope.passwordError = { password: "" };
  $scope.licenceError = { licence: "" };
  //filter used to filter e-mails
  var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  //filter to filter password
  //Autenticazione via token (se si è precedentementi loggati)
  if (curToken.enable == true) {
    $http({
      method: "POST",
      url: "http://localhost:3001/api",
      headers: { 'Content-Type': 'application/json' },
      data: { 'token': curToken.value }
    }).then(function SuccessoInfinito(response) {
      if (response.data.success) {
        //if i'm here i was logged, so redirect to the profile page
        $location.path("/profile");
      }
      else
        alert("Error! " + response.data.message);
    });
  }
  //function to control username field and show the errors if user wrong to type 
  $scope.controlUsernameField = function () {
    // alert("sono nel controllo username, la password è:"+$scope.password);    
    //if length is 0 user has type nothing
    if ($scope.username === undefined) {
      //username value is empty
      $scope.usernameError = { username: "*E-mail non scritta" };
      $scope.form.username.$invalid = true;
    }
    else {
      if (!emailFilter.test($scope.username)) {
        //username value fail the test 
        $scope.usernameError = { username: "*Mail in formato errato" };
        $scope.form.username.$invalid = true;
      }
      else {
        //username is in an acceptable structure
        $scope.usernameError = { username: "" };
        $scope.form.username.$invalid = false;
      }
    }
  }
  //function to control password field and show the errors if user wrong to type 
  $scope.controlPasswordField = function () {
    //if length is 0 user has type nothing
    if ($scope.password === undefined) {
      //input value is empty
      $scope.passwordError = { password: "*Password non scritta" };
      $scope.form.password.$invalid = true;
    }
    else {
      $scope.passwordError = { password: "" };
      $scope.form.password.$invalid = false;
    }
  }
  //function to control checkbox field 
  $scope.controlCheckBox = function () {
    if ($scope.licence == undefined) {
      //if i am here checkbox is not clicked
      $scope.licenceError = { licence: "*Non hai letto la nostra licenza?" };
      $scope.form.password.$invalid = true;
    }
    else {
      //if i am here checkbox is clicked
      $scope.licenceError = { licence: "" };
      $scope.form.licence.$invalid = false;
    }
  }
  // function to send data to server node
  $scope.login = function () {
    var parametri = {
      email: $scope.username,
      password: $scope.password
    };
    $http({
      method: "POST",
      url: "http://localhost:3001/api/authenticate",
      headers: { 'Content-Type': 'application/json' },
      data: parametri
    }).then(function mySuccess(response) {
      if (response.data.success) {
        //save token
        curToken.value = response.data.token;
        curToken.enable = true;
        //booleans admin
        //save datas in localStorage
        $localStorage.XToken = curToken;
        $localStorage.Email = $scope.username;
        $localStorage.admin = response.data.admin;
        if ($localStorage.admin == true) {
          $window.location.href = './indexAdmin.html';
        }
        else {
          $window.location.href = './indexUser.html';
        }

      }
      else
        alert("Error! " + response.data.message);
    }, function myError(response) {
      alert("Si è verificato un errore nella richiesta di autenticazione!");
    });
  }
});