// create the module for the index
var indexApp = angular.module('indexApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);

// configuring routes
indexApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './html/home/home.html',
      controller: 'homeController'
    })
    .when('/about', {
      templateUrl: './html/about/about.html',
      controller: 'aboutUsController'
    })
    .when('/photoGallery', {
      templateUrl: './html/photoGallery/photoGallery.html',
      controller: 'photoGalleryController'
    })
    .when('/login', {
      templateUrl: './html/login/login.html',
      controller: 'gestisciLogin'
    })
    .when('/contact', {
      templateUrl: './html/contact/contact.html'
    })
    .when('/signUp', {
      templateUrl: './html/signUp/signUp.html',
      controller: 'signUp'
    })
    .when('/profile', {
      templateUrl: './html/user/user.html',
      controller: 'userController'
    })
    .when('/user', {
      templateUrl: './html/login/login.html',
      controller: 'filterUserController'
    })

});


//  variabile contenente il token
var curToken = { value: "", enable: false };

/**
 * DEFINE FUNCTION TO CONTROLL IF USER HAS LOGGED IN
 * return true if user logged in and false if not
 */
var controlIfLogin = function () {
  if (curToken.enable == true) {
    return true;
  }
  else {
    return false;
  }
}

//controller to activate button 
indexApp.controller('navbarController', function () {
  controlIfLogin();
});


// create the controller and inject Angular's $scope
indexApp.controller('homeController', function ($scope) {
  $scope.message = "Home Page";
});

// create the controller and inject Angular's $scope
indexApp.controller('photoGalleryController', function ($scope) {
  // Set of Photos
  $scope.photos = [
    {
      src: './CSS/images/camerino.jpg',
      title: 'Centro di Camerino',
    },
    {
      src: './CSS/images/fotoPolo.png',
      title: 'Università di Camerino',
    },
    {
      src: './CSS/images/roccaCamerino.jpg',
      title: 'La Rocca di Camerino',
    }
  ];
  //INDEX
  $scope.indexPhoto = 0;
  //length of array photo
  $scope.lenghtOfArray = $scope.photos.length;
  //PRESENT PHOTO
  $scope.presentPhoto = $scope.photos[$scope.indexPhoto];
  //tile of photo gallery
  $scope.message = "Photo gallery";
  //next photo function
  $scope.nextPhotoFunction = function () {
    if ($scope.indexPhoto === $scope.photos.length - 1) {
      $scope.nextPhotoDisabled = true;
    }
    else {
      $scope.nextPhotoDisabled = false;
      $scope.previousPhotoDisabled = false;
      $scope.indexPhoto++;
      $scope.presentPhoto = $scope.photos[$scope.indexPhoto];
    }
  };
  //previous photo function
  $scope.previousPhotoFunction = function () {
    //console.log(indexPhoto);
    if ($scope.indexPhoto === 0) {
      $scope.previousPhotoDisabled = true;
    }
    else {
      $scope.previousPhotoDisabled = false;
      $scope.nextPhotoDisabled = false;
      $scope.indexPhoto--;
      $scope.presentPhoto = $scope.photos[$scope.indexPhoto];
    }
  };
});



/**
 * Username is the e-mail of the persone who want to access in it's personal profile
 */
indexApp.controller('gestisciLogin', function ($scope, $http, $location) {
  //messaggio di entrata
  $scope.message = "Login page";
  //errori rilevabili nei campi
  $scope.usernameError = { username: "" };
  $scope.passwordError = { password: "" };
  $scope.licenceError = { licence: "" };
  //filter used to filter e-mails
  var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  //filter to filter password
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
  //Autenticazione via token (se si è precedentementi loggati)
  if (curToken.enable == true) {
    $http({
      method: "POST",
      url: "http://localhost:3001/api",
      headers: { 'Content-Type': 'application/json' },
      data: { 'token': curToken.value }
    }).then(function SuccessoInfinito(response) {
      if (response.data.success) {
        alert(response.data.message);
        //  Qui bisogna reindirizzare verso la pagina dell' user loggato
      }
      else
        alert("Error! " + response.data.message);
    });
  }
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
  // funzione per l'invio dei dati di login a node
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
        curToken.value = response.data.token;
        curToken.enable = true;
        $location.path("/user");
      }
      else
        alert("Error! " + response.data.message);
    }, function myError(response) {
      alert("Si è verificato un errore nella richiesta di autenticazione!");
    });
  }
});

//controller che filtra se l'utente è loggato o meno
indexApp.controller("filterUserController", function ($scope, $http, $window, $location) {
  //TO DEFINE
  $window.location.href = '../indexUser.html';
});

//controller della parte dopo il log-in
indexApp.controller("userController", function ($scope) {
  //INIZIALIZE OF MANY VARIABLES
  //iban filter 
  var ibanFilter = /^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/;
  //ERRORS
  //errors that could be thrown
  $scope.paymentErrors =
    {
      error: ""
    };
  //errors that could be thrown
  $scope.ibanErrors =
    {
      error: ""
    };

  //json object of user profile
  var userProfile = {
    username: "Lorenzo Stacchio",
    saldo: 50,
    countNumber: 15268151,
    dataCreazioneConto: "10/5/2017",
    movimenti: [
      {
        data: "12/05/2017",
        spesa: 0,
        entrata: 0,
      },
      {
        data: "5/05/2017",
        spesa: -20,
        entrata: 10,
      },
      {
        data: "20/07/2017",
        spesa: -30,
        entrata: 40,
      },
      {
        data: "12/05/2017",
        spesa: -10,
        entrata: 50,
      },
      {
        data: "5/05/2017",
        spesa: 0,
        entrata: 30,
      },
      {
        data: "12/05/2017",
        spesa: 0,
        entrata: 0,
      },
      {
        data: "5/05/2017",
        spesa: -20,
        entrata: 10,
      },
      {
        data: "20/07/2017",
        spesa: -30,
        entrata: 40,
      },
      {
        data: "12/05/2017",
        spesa: -10,
        entrata: 50,
      },
      {
        data: "5/05/2017",
        spesa: 0,
        entrata: 30,
      }
    ]
  };

  //MESSAGE VARIABLES
  $scope.context = "Benvenuto nel tuo profilo privato!";
  //profile username
  $scope.username = userProfile.username;

  //OTHER VARIABLES
  //button that manage the page of movement
  $scope.buttonMovementsClicked = false;
  //button that manage the page of paymet
  $scope.paymentButtonClicked = false;
  /**
   * This path it's useless at this level of file, but this path will be used in indexUser.html
   * which is at the right level 
   */
  $scope.userImagePath = "../../CSS/images/Fondatori/Ls.png";

  //MOVEMENTS AREA
  //function to show movements in the lasts three monts
  $scope.showMovement = function () {
    $scope.paymentButtonClicked = false;
    $scope.graphButtonClicked = false;
    $scope.context = "Benvenuto nella pagina dei movimenti bancari";
    $scope.movimentiBancari = userProfile.movimenti;
    $scope.buttonMovementsClicked = true;
  };

  //SPENT AT AVERAGE AREA
  //function that show spent at day in average
  $scope.showSpentAtDayAverage = function () {
    $scope.buttonMovementsClicked = false;
    $scope.paymentButtonClicked = false;
    $scope.graphButtonClicked = false;
    //take the date of creatione of the count
    this.dateOfCreation = new Date(userProfile.dataCreazioneConto);
    //take the current day
    this.currentDay = Date.now();
    //differences between the two dates
    this.numberOfDays = this.currentDay - this.dateOfCreation.getDate();
    //take the sum of the passive
    this.sumOfPassive = 0;
    //define a function into the for each called on the movement's array to find the average of the spent
    //of the user for every day
    userProfile.movimenti.forEach(function (movimento) {
      this.sumOfPassive += Number(movimento.spesa);
    }, this);
    //return the sum divided by the total of the days with some activity
    this.average = Math.round(this.sumOfPassive / this.numberOfDays).toFixed(2);
    $scope.context = "La tua spesa giornaliera media è di: " + this.average;
  };

  //PAYMENT AREA
  //function that permits to do a payment 
  $scope.showPayment = function () {
    $scope.context = "Da qui puoi effettuare un bonifico";
    $scope.paymentButtonClicked = true;
    $scope.buttonMovementsClicked = false;
    $scope.graphButtonClicked = false;
  };
  //functions that do the payment
  //functio to control if payment is acceptable
  $scope.controlPayment = function () {
    //cifra scritta dall'utente
    this.pagamento = Number($scope.payment);
    //limite minimo per effettuare un bonifico
    //limite massimo dato dai soldi che l'utente ha nel conto
    if (this.pagamento < 50) {
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
  //function that control validity of iban
  $scope.controlIban = function () {
    if ($scope.iban == undefined) {
      //user didn't write nothing yet, it' not an error
      $scope.form.iban.$invalid = false;
      $scope.ibanErrors.error = "";
    }
    // alert(ibanFilter.test($scope.iban));
    else if (!(ibanFilter.test($scope.iban))) {
      //error
      //alert("iban scorretto");
      $scope.form.iban.$invalid = true;
      $scope.ibanErrors.error = "*Iban in formato errato";
    }
    else {
      //error
      //alert("iban corretto");             
      $scope.form.iban.$invalid = false;
      $scope.ibanErrors.error = "";
    }

  };



  //GRAPH AREA


  //GRAPH VARIABLES 
  //Function to show graph
  //data of user entrance 
  $scope.userEntrance = [];
  $scope.showGraph = function () {
    $scope.context = "Benvenuto nella sezione dei grafici";
    $scope.graphButtonClicked = true;
    $scope.paymentButtonClicked = false;
    $scope.buttonMovementsClicked = false;
    for (i = 0; i < userProfile.movimenti.length; i++) {
      $scope.userEntrance[i] = userProfile.movimenti[i].entrata;
      //in this phase i want to put the user exit in positive because i want a versus with entrance
      $scope.userExit[i] = userProfile.movimenti[i].spesa * -1;
    }
  }
  //ENTRANCE GRAPH
  //boolean to show entrace graph
  $scope.entranceBGraphClicked = false;
  //Function to show activeEntranceGraph
  $scope.activeEntranceGraph = function () {
    $scope.exitBGraphClicked = false;
    $scope.versusBGraphClicked = false;
    $scope.entranceBGraphClicked = true;
  };
  //define title of entrance graph
  $scope.JsonGraphEntrance = {
    type: 'line',
    legend: {
    },
    plot: {
      animation: {
        effect: "ANIMATION_FADE_IN",
        speed: 3000
      }
    },
    title: {
      text: "Entrance"
    },
    series: [
      {
        lineColor: "#27C322",
        values: $scope.userEntrance,
        text: "Entrance"
      }
    ]
  }
  //EXIT GRAPH
  //boolean to show exit graph
  //data of user exit 
  $scope.userExit = [];
  $scope.exitBGraphClicked = false;
  //Function to show activeExitGraph
  $scope.activeExitGraph = function () {
    $scope.entranceBGraphClicked = false;
    $scope.versusBGraphClicked = false;
    $scope.exitBGraphClicked = true;

  };
  //define title of exit graph
  $scope.JsonGraphExit = {
    type: 'line',
    legend: {
    },
    plot: {
      animation: {
        effect: "ANIMATION_FADE_IN",
        speed: 3000
      }
    },
    title: {
      text: "Exit"
    },
    series: [
      {
        lineColor: "#CD1622",
        values: $scope.userExit,
        text: "Exit"
      }
    ]
  }


  //VERSUS GRAPH
  //boolean to show versus graph
  $scope.versusBGraphClicked = false;
  //Function to show activeExitGraph
  $scope.activeVersusGraph = function () {
    $scope.entranceBGraphClicked = false;
    $scope.exitBGraphClicked = false;
    $scope.versusBGraphClicked = true;
  };
  //define title of versus graph
  $scope.JsonGraphVersus = {
    type: 'line',
    legend: {
    },
    plot: {
      animation: {
        effect: "ANIMATION_FADE_IN",
        speed: 3000
      }
    },
    title: {
      text: "Versus Graph"
    },
    series: [
      {
        lineColor: "#27C322",
        values: $scope.userEntrance,
        text: "Entrance"
      },
      {
        lineColor: "#CD1622",
        values: $scope.userExit,
        text: "Exit"
      }
    ]
  }
  //MESSAGE AREA
  //save the variable to show the real saldo
  $scope.moneyMessage = userProfile.saldo + " €";
  //save the variabile to show the real countNumber
  $scope.countNumber = userProfile.countNumber;
});

//SIGNUP CONTROLLER
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
      $scope.emailError = { email: "*E-mail non scritta" };
      $scope.form.email.$invalid = true;
    }
    else {
      if (!emailFilter.test($scope.email)) {
        //username value fail the test 
        $scope.emailError = { email: "*Mail in formato errato" };
        $scope.form.email.$invalid = true;
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
        "-Almeno una lettera maiuscola;-Almeno 8 di questi caratteri."
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
  //pin errors
  $scope.pinErrors = {
    error: ""
  };
  //function to control pin field
  $scope.controllaPin = function () {
    //save pin like string
    var pinNumber = $scope.pin.toString();   
    if($scope.pin===null){
      $scope.form.pin.$invalid = true;
      $scope.pinErrors = {
        error: "*Non hai scritto il pin"
      };
    }
    else if (pinNumber.length < 5) {
      $scope.form.pin.$invalid = true;
      $scope.pinErrors = {
        error: "*Il pin è troppo corto"
      };
    }
    else if (pinNumber.length > 5) {
      $scope.form.pin.$invalid = true;
      $scope.pinErrors = {
        error: "*Il pin è troppo lungo"
      };
    }
    else {
      $scope.form.pin.$invalid = false;              
      $scope.pinErrors = {
        error: ""
      };
    }
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
    var parametri = {
      email: $scope.email,
      password: $scope.password,
      pin: $scope.pin
    }

    $http({
      method: "POST",
      url: "http://localhost:3001/singup",
      headers: { 'Content-Type': 'application/json' },
      data: parametri
    }).then(function mySuccess(response) {
      if (response.data.success) {
        alert(response.data.message);
        $location.path("/login");
      }
      else
        alert("Error! " + response.data.message);
    }, function myError(response) {
      alert("Si è verificato un errore nella richiesta di autenticazione!");
    });
  }

  //controller della parte dopo il log-in
  indexApp.controller("userController", function ($scope) {
    //INIZIALIZE OF MANY VARIABLES
    //iban filter 
    var ibanFilter = /^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/;
    //ERRORS
    //errors that could be thrown
    $scope.paymentErrors =
      {
        error: ""
      };
    //errors that could be thrown
    $scope.ibanErrors =
      {
        error: ""
      };

    //json object of user profile
    var userProfile = {
      username: "Lorenzo Stacchio",
      saldo: 50,
      countNumber: 15268151,
      dataCreazioneConto: "10/5/2017",
      movimenti: [
        {
          data: "12/05/2017",
          spesa: 0,
          entrata: 0,
        },
        {
          data: "5/05/2017",
          spesa: -20,
          entrata: 10,
        },
        {
          data: "20/07/2017",
          spesa: -30,
          entrata: 40,
        },
        {
          data: "12/05/2017",
          spesa: -10,
          entrata: 50,
        },
        {
          data: "5/05/2017",
          spesa: 0,
          entrata: 30,
        },
        {
          data: "12/05/2017",
          spesa: 0,
          entrata: 0,
        },
        {
          data: "5/05/2017",
          spesa: -20,
          entrata: 10,
        },
        {
          data: "20/07/2017",
          spesa: -30,
          entrata: 40,
        },
        {
          data: "12/05/2017",
          spesa: -10,
          entrata: 50,
        },
        {
          data: "5/05/2017",
          spesa: 0,
          entrata: 30,
        }
      ]
    };

    //MESSAGE VARIABLES
    $scope.context = "Benvenuto nel tuo profilo privato!";
    $scope.username = userProfile.username;

    //OTHER VARIABLES
    //button that manage the page of movement
    $scope.buttonMovementsClicked = false;
    //button that manage the page of paymet
    $scope.paymentButtonClicked = false;
    /**
     * This path it's useless at this level of file, but this path will be used in indexUser.html
     * which is at the right level 
     */
    $scope.userImagePath = "../../CSS/images/Fondatori/Ls.png";

    //MOVEMENTS AREA
    //function to show movements in the lasts three monts
    $scope.showMovement = function () {
      $scope.paymentButtonClicked = false;
      $scope.graphButtonClicked = false;
      $scope.context = "Benvenuto nella pagina dei movimenti bancari";
      $scope.movimentiBancari = userProfile.movimenti;
      $scope.buttonMovementsClicked = true;
    };

    //SPENT AT AVERAGE AREA
    //function that show spent at day in average
    $scope.showSpentAtDayAverage = function () {
      $scope.buttonMovementsClicked = false;
      $scope.paymentButtonClicked = false;
      $scope.graphButtonClicked = false;
      //take the date of creatione of the count
      this.dateOfCreation = new Date(userProfile.dataCreazioneConto);
      //take the current day
      this.currentDay = Date.now();
      //differences between the two dates
      this.numberOfDays = this.currentDay - this.dateOfCreation.getDate();
      //take the sum of the passive
      this.sumOfPassive = 0;
      //define a function into the for each called on the movement's array to find the average of the spent
      //of the user for every day
      userProfile.movimenti.forEach(function (movimento) {
        this.sumOfPassive += Number(movimento.spesa);
      }, this);
      //return the sum divided by the total of the days with some activity
      this.average = Math.round(this.sumOfPassive / this.numberOfDays).toFixed(2);
      $scope.context = "La tua spesa giornaliera media è di: " + this.average;
    };

    //PAYMENT AREA
    //function that permits to do a payment 
    $scope.showPayment = function () {
      $scope.context = "Da qui puoi effettuare un bonifico";
      $scope.paymentButtonClicked = true;
      $scope.buttonMovementsClicked = false;
      $scope.graphButtonClicked = false;
    };
    //functions that do the payment
    //functio to control if payment is acceptable
    $scope.controlPayment = function () {
      //cifra scritta dall'utente
      this.pagamento = Number($scope.payment);
      //limite minimo per effettuare un bonifico
      //limite massimo dato dai soldi che l'utente ha nel conto
      if (this.pagamento < 50) {
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
    //function that control validity of iban
    $scope.controlIban = function () {
      if ($scope.iban == undefined) {
        //user didn't write nothing yet, it' not an error
        $scope.form.iban.$invalid = false;
        $scope.ibanErrors.error = "";
      }
      // alert(ibanFilter.test($scope.iban));
      else if (!(ibanFilter.test($scope.iban))) {
        //error
        //alert("iban scorretto");
        $scope.form.iban.$invalid = true;
        $scope.ibanErrors.error = "*Iban in formato errato";
      }
      else {
        //error
        //alert("iban corretto");             
        $scope.form.iban.$invalid = false;
        $scope.ibanErrors.error = "";
      }

    };
    //GRAPH AREA


    //GRAPH VARIABLES 
    //Function to show graph
    //data of user entrance 
    $scope.userEntrance = [];
    $scope.showGraph = function () {
      $scope.context = "Benvenuto nella sezione dei grafici";
      $scope.graphButtonClicked = true;
      $scope.paymentButtonClicked = false;
      $scope.buttonMovementsClicked = false;
      for (i = 0; i < userProfile.movimenti.length; i++) {
        $scope.userEntrance[i] = userProfile.movimenti[i].entrata;
        //in this phase i want to put the user exit in positive because i want a versus with entrance
        $scope.userExit[i] = userProfile.movimenti[i].spesa * -1;
      }
    }
    //ENTRANCE GRAPH
    //boolean to show entrace graph
    $scope.entranceBGraphClicked = false;
    //Function to show activeEntranceGraph
    $scope.activeEntranceGraph = function () {
      $scope.exitBGraphClicked = false;
      $scope.versusBGraphClicked = false;
      $scope.entranceBGraphClicked = true;
    };
    //define title of entrance graph
    $scope.JsonGraphEntrance = {
      type: 'line',
      legend: {
      },
      plot: {
        animation: {
          effect: "ANIMATION_FADE_IN",
          speed: 3000
        }
      },
      title: {
        text: "Entrance"
      },
      series: [
        {
          lineColor: "#27C322",
          values: $scope.userEntrance,
          text: "Entrance"
        }
      ]
    }
    //EXIT GRAPH
    //boolean to show exit graph
    //data of user exit 
    $scope.userExit = [];
    $scope.exitBGraphClicked = false;
    //Function to show activeExitGraph
    $scope.activeExitGraph = function () {
      $scope.entranceBGraphClicked = false;
      $scope.versusBGraphClicked = false;
      $scope.exitBGraphClicked = true;

    };
    //define title of exit graph
    $scope.JsonGraphExit = {
      type: 'line',
      legend: {
      },
      plot: {
        animation: {
          effect: "ANIMATION_FADE_IN",
          speed: 3000
        }
      },
      title: {
        text: "Exit"
      },
      series: [
        {
          lineColor: "#CD1622",
          values: $scope.userExit,
          text: "Exit"
        }
      ]
    }


    //VERSUS GRAPH
    //boolean to show versus graph
    $scope.versusBGraphClicked = false;
    //Function to show activeExitGraph
    $scope.activeVersusGraph = function () {
      $scope.entranceBGraphClicked = false;
      $scope.exitBGraphClicked = false;
      $scope.versusBGraphClicked = true;
    };
    //define title of versus graph
    $scope.JsonGraphVersus = {
      type: 'line',
      legend: {
      },
      plot: {
        animation: {
          effect: "ANIMATION_FADE_IN",
          speed: 3000
        }
      },
      title: {
        text: "Versus Graph"
      },
      series: [
        {
          lineColor: "#27C322",
          values: $scope.userEntrance,
          text: "Entrance"
        },
        {
          lineColor: "#CD1622",
          values: $scope.userExit,
          text: "Exit"
        }
      ]
    }
    //MESSAGE AREA
    //save the variable to show the real saldo
    $scope.moneyMessage = userProfile.saldo + " €";
    //save the variabile to show the real countNumber
    $scope.countNumber = userProfile.countNumber;
  });
});

//controller of aboutUs page
indexApp.controller('aboutUsController', function ($scope) {
  // Set of userPhotos
  $scope.userPhotos = [
    {
      src: './CSS/images/Fondatori/Ls.png',
      title: 'Lorenzo Stacchio',
    },
    {
      src: './CSS/images/Fondatori/Ml.png',
      title: 'Matteo Lupini',
    },
    {
      src: './CSS/images/Fondatori/Lm.png',
      title: 'Luca Marasca',
    },
    {
      src: './CSS/images/Fondatori/Nr.png',
      title: 'Nicolò Ruggeri',
    }
  ];
  //INDEX
  $scope.indexPhoto = 0;
  //length of array photo
  $scope.lenghtOfArray = $scope.userPhotos.length;
  //PRESENT PHOTO
  $scope.presentPhoto = $scope.userPhotos[$scope.indexPhoto];
  //tile of photo gallery
  $scope.message = "About us";
  //next photo function
  $scope.nextPhotoFunction = function () {
    //if true, i'm at the last photo
    if ($scope.indexPhoto === $scope.userPhotos.length - 1) {
      $scope.nextPhotoDisabled = true;
    }
    else {
      $scope.nextPhotoDisabled = false;
      $scope.previousPhotoDisabled = false;
      $scope.indexPhoto++;
      $scope.presentPhoto = $scope.userPhotos[$scope.indexPhoto];
    }
  };
  //previous photo function
  $scope.previousPhotoFunction = function () {
    //if true, i'm at the first photo
    if ($scope.indexPhoto === 0) {
      $scope.previousPhotoDisabled = true;
    }
    else {
      $scope.previousPhotoDisabled = false;
      $scope.nextPhotoDisabled = false;
      $scope.indexPhoto--;
      $scope.presentPhoto = $scope.userPhotos[$scope.indexPhoto];
    }
  };
});
