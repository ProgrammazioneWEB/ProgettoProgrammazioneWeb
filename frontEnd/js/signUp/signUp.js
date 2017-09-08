var indexApp = angular.module('indexApp', []);

indexApp.controller("signUp", function ($scope) {
  $scope.message = "Benvenuto nella pagina \n di registrazione!";
  //filter used to filter e-mails
  var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  //filter used to filter e-mails
  /**
   * should contain at least one digit,
   * should contain at least one lower case,
   * should contain at least one upper case,
   * should contain at least one number,
   * should contain at least 8 from the mentioned characters:
   * helloworld = fail;
   * helloWorld = fail;
   * helloWorld1 = succes;
   */
  var passwordFilter = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  //errors
  $scope.emailError = { error: "" };
  $scope.licenceError = { licence: "" };
  $scope.passwordError = { password: "" };
  $scope.passwordReapeatError = { passwordReapeat: "" };
  //function to control username field and show the errors if user wrong to type 
  $scope.controllaMail = function () {
    //if length is 0 user has type nothing
    if ($scope.email === undefined) {
      //username value is empty
      $scope.form.email.$invalid = true;
      $scope.emailError = { email: "*E-mail non scritta" };
    }
    else {
      if (!emailFilter.test($scope.email)) {
        //username value fail the test 
        $scope.form.email.$invalid = true;
        $scope.emailError = { email: "*Mail in formato errato" };
      }
      else {
        //username is in an acceptable structure
        $scope.emailError = { email: "" };
        $scope.form.email.$invalid = false;
      }
    }
  }
  //function to control password field and show errors is user wrong to tupe
  $scope.controllaPassword = function () {
    if ($scope.password === undefined) {
      $scope.form.password.$invalid = true;
      $scope.passwordError = { password: "La password deve contenere almeno una lettera;" };
    }
    else if (!passwordFilter.test($scope.password)) {
      $scope.form.password.$invalid = true;
      $scope.passwordError = {
        password: "La password deve contenere:-Almeno una lettera minuscola;" +
        "-Almeno una lettera maiuscola; -Almeno un numero; -Almeno 8 di questi caratteri."
      };
    }
    else {
      $scope.form.password.$invalid = false;
      $scope.passwordError = { password: "" };
    }
  };
  //function to control passwordRepeate field and show errors is user wrong to tupe
  $scope.controllaPasswordRipetuta = function () {
    if ($scope.passwordRipetuta != $scope.password) {
      $scope.form.passwordRipetuta.$invalid = true;
      $scope.passwordRepeatError = { passwordRepeat: "La password non corrispondono" };
    }
    else {
      $scope.form.passwordRipetuta.$invalid = false;
      $scope.passwordRepeatError = { passwordRepeat: "" };
    }
  };
  //functio to control pin field
  $scope.controllaPin = function () {
    //TO DEFINE
  };
  //function to control checkbox field 
  $scope.controlCheckBox = function () {
    if ($scope.licence == undefined) {
      //if i am here checkbox is not clicked
      $scope.licenceError = { licence: "*Non hai accettato il nostro contratto licenza" };
      $scope.form.password.$invalid = true;
    }
    else {
      //if i am here checkbox is clicked
      $scope.licenceError = { licence: "" };
      $scope.form.licence.$invalid = false;
    }
  }
  //function to send dates to server
  $scope.sendData = function () {
    //TO DEFINE
    userDate = {
      email: $scope.email,
      password: $scope.password,
      pin: $scope.pin,
      picture: $scope.picture,
      contrattoLetto: $scope.licenceError
    }
  }

});
