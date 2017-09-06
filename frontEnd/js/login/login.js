var indexApp = angular.module('indexApp', []);

/**
 * Username is the e-mail of the persone who want to access in it's personal profile
 */
indexApp.controller('gestisciLogin', function ($scope) {
  //messaggio di entrata
  $scope.message = "Login page";
  //errori rilevabili nei campi
  $scope.usernameError = { username: "" };
  $scope.passwordError = { password: "" };
  $scope.licenceError = { licence: "" };

  //filter used to filter e-mails
  var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  //filter to filter password
  var passwordFilter = "";
  //function to control username field and show the errors if user wrong to type 
  $scope.controlUsernameField = function () {
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
      if (!passwordFilter.test($scope.username)) {
        $scope.passwordError = { password: "*Password in formato errato" };
        $scope.form.password.$invalid = true;
      }
      else {
        $scope.passwordError = { password: "" };
        $scope.form.password.$invalid = false;
      }
    }
  }
  //function to control checkbox field 
  $scope.controlCheckBox = function () {
    if ($scope.licence==undefined) {
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
//funzione di login 
  $scope.login = function () {
    userDates={
      username: this.username,
      password: this.password
    }
  }

});
