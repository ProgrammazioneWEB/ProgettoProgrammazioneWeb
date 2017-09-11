
// ============================
// = get the packages we need =
// ============================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model
var Movimento = require('./app/models/movement');
var Pin = require('./app/models/pin');
var Advise = require('./app/models/advise');
var database = require('./database'); // Importo il file per la gestione del database

// =======================
// ==== configuration ====
// =======================
var port = 3001 || process.env.PORT; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable (prelevata da config.js)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// Creo una funzione per abilitare i CORS (sono i permessi per essere acceduti da server web con porta e/o indirizzo diverso)
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Vanno poi indicate le origini specifiche prima della consegna
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');  // non mi servono tutti
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //  Vado avanti solo se non è stata richiesta l'opzione dei cors
  if ('OPTIONS' === req.method) {
    res.send(200);//  altrimenti restituisco OK come status di rispsota html
  } else {
    next();
  }
};

// Abilito i CORS
app.use(allowCrossDomain);

// Inizializzo il database tramite la funzione init presente in database.js
database.init();

// =======================
// routes ================
// =======================

// basic route (momentaneamente solo di test)
app.get('/', function (req, res) {
  // creo il nuovo utente con i dati 
  var user = new User({
    email: 'testA@gmail.com',
    password: 'password',
    meta: {
      //Nome dell'utente
      firstName: 'Nicolò',
      //Cognome dell'utente
      lastName: 'Ruggeri',
      //Data di nascita dell'utente
      dateOfBirth: '24/10/1995',
      //numero di telefono dell'utente
      numberOfPhone: '0932740753978',
      //Residenza dell'utente
      residence: 'casa mia',
      //Codice fiscale dell'utente
      fiscalCode: '097u45032r9yf2f'
    },
    numberOfAccount: 100,
    availableBalance: 5500
  });

  var user2 = new User({
    email: 'testB@gmail.com',
    password: 'password',
    meta: {
      //Nome dell'utente
      firstName: 'Matteo',
      //Cognome dell'utente
      lastName: 'Lupini',
      //Data di nascita dell'utente
      dateOfBirth: 'non lo so',
      //numero di telefono dell'utente
      numberOfPhone: '0345753978',
      //Residenza dell'utente
      residence: 'casa mia',
      //Codice fiscale dell'utente
      fiscalCode: '3g43q4g465g'
    },
    numberOfAccount: 200,
    availableBalance: 5000
  });

  today = new Date();

  var mov = new Movimento({
    from: 100,
    to: 200,
    date: today.getDate(),
    quantity: 500
  });

  database.addUser(user, function (result, messaggio) {
    console.log(messaggio);
    database.addUser(user2, function (result, messaggio) {
      console.log(messaggio);
      database.sortUsersByNumberOfAccount(function (result) {
        console.log(result);
      });
      database.addTransaction(mov, function (result, messaggio) {
        console.log(messaggio);
        database.allMovementsSend(100, function (result) {
          console.log(result);
        });
        mov = new Movimento({
          from: 200,
          to: 100,
          date: today.getDate(),
          quantity: 1500
        });
        database.addTransaction(mov, function (result, messaggio) {
          console.log(messaggio);
          database.allMovementsSend(200, function (result) {
            console.log(result);
          });
          mov = new Movimento({
            from: 100,
            to: 200,
            date: today.getDate(),
            quantity: 500
          });
          database.addTransaction(mov, function (result, messaggio) {
            console.log(messaggio);
            database.allMovementsSend(100, function (result) {
              console.log(result);
            });
            res.json({
              success: result,
              message: messaggio
            });
          });
        });
      });
    });
  });

  /*var megapin = new Pin({
    number: 55555,
    meta: {
      //Nome dell'utente
      firstName: 'Nome',
      //Cognome dell'utente
      lastName: 'Cognome',
      //Data di nascita dell'utente
      dateOfBirth: '1950-01-01',
      //numero di telefono dell'utente
      numberOfPhone: '059239845',
      //Residenza dell'utente
      residence: 'Casa',
      //Codice fiscale dell'utente
      fiscalCode: 'NCGM01B0150'
    }
  });

  database.insertPin(megapin, function (result, messaggio) {
    res.json({
      success: result,
      message: messaggio
    });
  });*/
});

app.get('/list', function (req, res) {
  database.sortUsersByNumberOfAccount(function (result) {
    res.json(result);
  });
});

app.get('/movimenti-out', function (req, res) {
  database.allMovementsSend(100, function (result) {
    res.json(result);
  });
});

app.get('/movimenti-in', function (req, res) {
  database.allMovementsReceive(100, function (result) {
    res.json(result);
  });
});

//  Registra un nuovo utente
app.post('/singup', function (req, res) {
  database.verifyPin(req.body.pin, function (result) {
    if (!result)  // Se il pin non esiste rispondo con un errore
    {
      res.json({
        success: false,
        message: 'Pin errato.'
      });
      return;
    }

    //  Se invece il pin esiste, prelevo i dati personali dell' utente da associare all' email
    var metadata = result.meta;

    //  Controllo che l'email non sia già stata registrata
    database.findUserByEmail(req.body.email, function (result) {
      //  Se è già registrata non posso registrarla nuovamente
      if (result) {
        res.json({
          success: false,
          message: 'Email già in uso.'
        });
        return;
      }

      //  Se non è registrata procedo
      //  Calcolo il numero del conto del nuovo utente
      database.findMaxNumberOfAccount(function (result) {
        var nAccount = 0; //  Se non esistono altri conti sarà il numero 0

        if (result.length > 0)
          if (result[0].numberOfAccount != undefined)
            nAccount = (result[0].numberOfAccount + 1);

        //  Creo il nuovo utente
        var user = new User({
          email: req.body.email,
          password: req.body.password,
          meta: metadata,
          numberOfAccount: nAccount,
          availableBalance: 1000
        });

        //  Lo aggiungo al database
        database.addUser(user, function (result, messaggio) {
          if (result) {
            //  Elimino il pin dalla lista
            database.deleteRecordPin(req.body.pin);
          }

          //  Rispondo con un messaggio di operazione riuscita (se va a buon fine)
          res.json({
            success: result,
            message: messaggio
          });
        });
      });
    });
  });
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user
apiRoutes.post('/authenticate', function (req, res) {

  var result = database.autenticate(req.body.email, req.body.password, function (result, messaggio) {

    if (result == false) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }
    else {
      // create a token
      var token = jwt.sign('prova', app.get('superSecret'), {
        //expiresInMinutes: 1440 // expires in 24 hours (ATTENZIONE non funziona su windows)
      });

      // Salvo il token nel browser del utente autenticato (sotto il nome di authToken)
      //res.cookie('authToken',token);          

      // return the information including token as JSON
      res.json({
        success: true,
        message: 'Successfull!',
        token: token
      });
    };
  });
});

// route middleware to verify a token
apiRoutes.use(function (req, res, next) {

  // check header or url parameters or post parameters or cookie 
  var token = req.headers['x-access-token'] || req.body.token || req.query.token; // || req.cookies.authToken;

  // decode token
  if (token) {

    // verifies secret and checks exp (controllo che non sia tarocco)
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// route to show a random message
apiRoutes.post('/', function (req, res) {
  res.json({
    message: 'Welcome to the API!',
    success: true
  });
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Node è in funzione su http://localhost:' + port);

