
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
var Movimento = require('./app/models/movement'); // get our mongoose model
var Pin = require('./app/models/pin'); // get our mongoose model
var Advise = require('./app/models/advise'); // get our mongoose model
var UserToVerify = require('./app/models/userToVerify'); // get our mongoose model
var database = require('./database'); // Importo il file per la gestione del database
var moment = require('moment');

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
  var date = new Date();
  var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  // creo il nuovo utente con i dati 
  var user2 = new User({
    email: 'lorenzo.stacchio@studenti.unicam.it',
    password: 'password',
    meta: {
      //Nome dell'utente
      firstName: 'Lorenzo',
      //Cognome dell'utente
      lastName: 'Stacchio',
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
    availableBalance: 5000,
    dateOfCreation: today
  });

  var admin = new User({
    email: 'luca.marasca@studenti.unicam.it',
    password: 'password',
    admin: true,
    meta: {
      //Nome dell'utente
      firstName: 'Luca',
      //Cognome dell'utente
      lastName: 'Marasca',
      //Data di nascita dell'utente
      dateOfBirth: 'non lo so',
      //numero di telefono dell'utente
      numberOfPhone: '0345753978',
      //Residenza dell'utente
      residence: 'casa mia',
      //Codice fiscale dell'utente
      fiscalCode: '3g43q4g465g'
    },
    numberOfAccount: 100,
    availableBalance: 7000,
    dateOfCreation: today
  });

  var mov = new Movimento({
    from: 100,
    to: 200,
    date: today,
    quantity: 500
  });

  database.findUserByEmail(user2.email, function (result) {
    //  Se è già registrata non posso registrarla nuovamente
    if (result) {
      res.json({
        success: false,
        message: 'Utenti predefiniti già presenti nel DB'
      });
      return;
    }
    database.addUser(user2, function (result, messaggio) {
      console.log(messaggio);
      database.addUser(admin, function (result, messaggio) {
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
            date: today,
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
              date: today,
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
  });
});


//Test invio email

app.get('/provaposta', function (req, res) {
  var servizioPosta = require('nodemailer');  
  
  var postino = servizioPosta.createTransport({  
    service: 'gmail',  
    auth: {  
      user: 'banca.unicam@gmail.com',  
      pass: 'programmazioneweb'   
    }  
  });  
    
  postino.sendMail({  
    from: 'banca.unicam@gmail.com',  
    to: 'luca.marasca@studenti.unicam.it',  
    subject: 'hello',  
    text: 'hello world from node.js!'  
  }, function(err, info) {  
    if (err)  
      console.log(err);  
    if (info)  
      console.log(info);   
  });  
});



//Test vedere utenti
app.get('/list', function (req, res) {
  database.sortUsersByNumberOfAccount(function (result) {
    result.forEach(function(user) {
      console.log(user.email);
    }, this);
    res.json(result);
  });
});

//Test movimenti in uscita (si può cancellare)
app.get('/movimenti-out', function (req, res) {
  database.allMovementsSend(100, function (result) {
    res.json(result);
  });
});

//Test movimenti in ingresso (si può cancellare)
app.get('/movimenti-in', function (req, res) {
  database.allMovementsReceive(100, function (result) {
    res.json(result);
  });
});



//arrivo ultimi 5 avvisi
app.get('/get-avvisi', function (req, res) {
  database.returnLastFiveAdvises(function (result) {
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
    //Creo il link dinamico
    var date = new Date();
    var milliseconds = date.getMilliseconds;
    var testo = "Completa la registrazione";
    var indirizzo = "http://localhost:3001" + milliseconds;


    //Invio la mail di registrazione
    var servizioPosta = require('nodemailer');  
    
    var postino = servizioPosta.createTransport({  
      service: 'gmail',  
      auth: {  
        user: 'banca.unicam@gmail.com',  
        pass: 'programmazioneweb'   
      }  
    }); 
    postino.sendMail({  
        from: 'BANCA UNICAM',  
        to: req.body.email,  
        subject: "Conferma registrazione Banca Unicam",  
        text: document.write(testo.link(indirizzo))
      }, function(err, info) {  
        if (err)  
          console.log(err);  
        if (info)  
          console.log(info);   
      });  
    });
    var utente = new UserToVerify();
    utente.numberOfAccount = req.numberOfAccount;
    utente.link = indirizzo;
    database.addUserToVerify(utente, function (result) {
      //  Se è già registrata non posso registrarla nuovamente
      if (result) {
        res.json({
          success: false,
          message: "Non è stato possibile aggiungere l' utente da verificare"
        });
        return;
      }
    });
  });
});

app.post("/prova", function (req,res) //<-- devo mettere route dinamica
{
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
      availableBalance: 0
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
      // create a token (come dato di creazione del token viene utilizzata l'email associata)
      var token = jwt.sign(req.body.email, app.get('superSecret'), {
        //expiresInMinutes: 1440 // expires in 24 hours (ATTENZIONE non funziona su windows)
      });

      // Salvo il token nel browser del utente autenticato (sotto il nome di authToken)
      //res.cookie('authToken',token);          

      // return the information including token as JSON
      database.findUserByEmail(req.body.email, function (risultato) {
        // return the information including token as JSON
        if (risultato) {
          res.json({
            success: true,
            message: 'Successfull!',
            token: token,
            admin: risultato.admin
          });
        }
        else
          res.json({ success: false, message: 'Authentication failed. User not found.' });
      });
    }
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
        req.decoded = decoded;  //  Salvo l'email del possessore del token in memoria
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

//  Ritorna alla parte front-end l'utente corrispondente al token
apiRoutes.post('/userData', function (req, res) {
  database.findUserByEmail(req.body.email, function (result1) {
    //  Creo la variabile con i parametri di risposta al front-end
    var risposta = {
      success: false,
      result: result1
    };
    if (result1)
      risposta.success = true;
    res.json(risposta);
  });
});

//  Ritorna alla parte front-end l'utente corrispondente al token
apiRoutes.post('/userDataNAccount', function (req, res) {
  database.findUserByAccount(req.body.n_account, function (ris, result) {
    res.json({
      success: ris,
      result: result
    });
  });
});

//  Modifico i dati personali dell' utente
apiRoutes.post('/updateUserData', function (req, res) {
  database.findUserByEmail(req.decoded, function (result) {
    if (result) {
      database.modifyCredential(result, req.body.email, req.body.password, req.body.phone, req.body.residence, function (ris) {
        res.json({
          success: ris
        });
      });
    }
    else
      res.json({
        message: 'Errore, ci sono problemi con il database.',
        success: false
      });
  });
});

//  Restituisce la lista di tutti i movimenti di un utente (non necessita di parametri in ingresso)
apiRoutes.post('/movements', function (req, res) {
  // req.decoded  Contiene l'email di chi ha fatto la richiesta
  database.findUserByEmail(req.decoded, function (result) {
    if (result) {
      var nAccount = result.numberOfAccount;
      //  Richiedo i movimenti in uscita
      database.allMovementsReceive(nAccount, function (result) {
        var movIn;

        if (result) {
          movIn = result;
          database.allMovementsSend(nAccount, function (result) {
            var movOut;

            //  Se tutto va a buon fine formatto i dati e li restituisco
            if (result) {
              movOut = result;

              var allMov = [];
              var i = 0;

              //  Prendo tutti i movimenti in ingresso
              while (i < movIn.length) {
                allMov[i] = {
                  data: movIn[i].date,
                  entrata: movIn[i].quantity,
                  uscita: 0,
                  conto: movIn[i].from
                };
                i++;
              }

              var j = 0;

              //  Prendo tutti i movimenti in uscita
              while (j < movOut.length) {
                allMov[i] = {
                  data: movOut[j].date,
                  entrata: 0,
                  uscita: movOut[j].quantity,
                  conto: movOut[j].to
                };
                i++;
                j++;
              }

              //  Ritorno la lista dei movimenti all' utente
              res.json({
                success: true,
                result: allMov
              });

            }
            else {
              res.json({
                message: 'Errore, ci sono problemi con il tuo numero di conto.',
                success: false
              });
            }
          });
        }
        else {
          res.json({
            message: 'Errore, ci sono problemi con il tuo numero di conto.',
            success: false
          });
        }
      });
    }
    else  //  Questo errore si verifica solo in caso di perdida di dati nel db 
    {
      res.json({
        message: 'Errore interno, la tua email non è più presente nel database.',
        success: false
      });
    }
  });
});

//Test transazione e bonifico da amministratore
apiRoutes.post('/invio-bonifico-admin', function (req, res) {
  var date = new Date();
  var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  //  Controllo se l'utente loggato è amministratore
  database.findUserByEmail(req.decoded, function (result) {
    if (result) {
      if (result.admin) {
        var bonifico = new Movimento({
          from: req.body.from,
          to: req.body.to,
          date: today,
          quantity: req.body.quantity
        });

        database.addTransaction(bonifico, function (result, messaggio) {
          res.json({
            message: messaggio,
            success: result
          });
        });
      }
      else {  //  Se non è admin restituisco errore
        res.json({
          message: 'Impossible accedere a questa sezione senza essere admin.',
          success: false
        });
      }
    }
    else {  //  Se non trovo l'user nel db (si dovrebbe verificare solo in caso di errori nel db)
      res.json({
        message: 'Errore interno al database, impossibile verificare che si è loggati come admin.',
        success: false
      });
    }
  });
});

//Test transazione e bonifico da user
apiRoutes.post('/invio-bonifico-user', function (req, res) {
  var date = new Date();
  var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  //  Cerco il numero di conto di chi ha richiesto il bonifico (req.decoded contiene l'email del user loggato)
  database.findUserByEmail(req.decoded, function (result) {
    if (result) {
      var bonifico = new Movimento({
        from: result.numberOfAccount,
        to: req.body.to,
        date: today,
        quantity: req.body.quantity
      });
      //  Aggiungo la transazione al db e rispondo all' utente il messaggio di riuscita o errore
      database.addTransaction(bonifico, function (result, messaggio) {
        res.json({
          message: messaggio,
          success: result
        });
      });
    }
    else {  //  Se non trovo il numero di conto (si dovrebbe verificare solo in caso di errori nel db)
      res.json({
        message: 'Errore interno al database, il suo numero conto non è stato trovato.',
        success: false
      });
    }
  });
});

//  this function return the media of the cash sent in transaction
apiRoutes.post('/CalcolaMediaUscite', function (req, res) {
  database.findUserByEmail(req.decoded, function (user) {
    if (user)
      database.sumCashOutside(user.numberOfAccount, function (result, data) {

        if (!data) {
          res.json({
            success: false,
            message: 'Riscontrati problemi nel database.'
          });
        }
        else
          if (!data.sumQuantity)
            res.json({
              success: false,
              message: 'Riscontrati problemi nel database.'
            });
          else {
            var date = new Date();
            var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

            var then = moment(user.dateOfCreation, "YYYY-MM-DD");
            var now = moment(today, "YYYY-MM-DD");
            //  Ottengo la differenza in giorni
            var days = moment.duration(now.diff(then)).asDays();

            //  Se la differenza è negativa ci sono errori con le dati
            if (days < 0) {
              res.json({
                success: false,
                message: 'Riscontrati problemi con le date nel database.'
              });
            }
            else {
              //  Se sono passati zero giorni
              if (days == 0)
                days = 1; //  Non posso dividere per zero

              //  Calcolo la spesa giornaliera
              var ris = data.sumQuantity / days;

              res.json({
                success: result,
                message: 'Dati inviati correttamente.',
                data: ris
              });
            }
          }
      });
    else
      res.json({
        success: false,
        message: 'Riscontrati problemi nel database.'
      });
  });
});

//  this function return the media of the cash recieve in transaction
apiRoutes.post('/CalcolaMediaEntrate', function (req, res) {
  database.findUserByEmail(req.decoded, function (user) {
    if (user)
      database.sumCashInside(user.numberOfAccount, function (result, data) {

        if (!data) {
          res.json({
            success: false,
            message: 'Riscontrati problemi nel database.'
          });
        }
        else
          if (!data.sumQuantity)
            res.json({
              success: false,
              message: 'Riscontrati problemi nel database.'
            });
          else {
            var date = new Date();
            var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

            var then = moment(user.dateOfCreation, "YYYY-MM-DD");
            var now = moment(today, "YYYY-MM-DD");
            //  Ottengo la differenza in giorni
            var days = moment.duration(now.diff(then)).asDays();

            //  Se la differenza è negativa ci sono errori con le dati
            if (days < 0)
            {
              res.json({
                success: false,
                message: 'Riscontrati problemi con le date nel database.'
              });
            }
            else {
              //  Se sono passati zero giorni
              if (days == 0)
                days = 1; //  Non posso dividere per zero

              //  Calcolo la spesa giornaliera
              var ris = data.sumQuantity / days;

              res.json({
                success: result,
                message: 'Dati inviati correttamente.',
                data: ris
              });
            }
          }
      });
    else
      res.json({
        success: false,
        message: 'Riscontrati problemi nel database.'
      });
  });
});

//  invio avvisi
apiRoutes.post('/invio-avviso', function (req, res) {
  var date = new Date();
  var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  var avviso = new Advise({
    title: req.body.title,
    text: req.body.text,
    date: today
  });

  database.addAdvise(avviso, function (result, messaggio) {
    res.json({
      success: result,
      message: messaggio
    });
  });

  //Invio la mail alle persone interessate
  var servizioPosta = require('nodemailer');  
  
  var postino = servizioPosta.createTransport({  
    service: 'gmail',  
    auth: {  
      user: 'banca.unicam@gmail.com',  
      pass: 'programmazioneweb'   
    }  
  }); 
  //Richiedo al db la lista degli utenti presenti  
  database.sortUsersByNumberOfAccount(function (result) {
    //Con un foreach invio una e-mail contenente l'avviso a tutte le persone interessate
    result.forEach(function(user) {
      postino.sendMail({  
        from: 'BANCA UNICAM',  
        to: user.email,  
        subject: req.body.title,  
        text: req.body.text  
      }, function(err, info) {  
        if (err)  
          console.log(err);  
        if (info)  
          console.log(info);   
      });  

    }, this);
    
  });  
  
});

//  Funzione per disabilitazione account
apiRoutes.post('/off', function (req, res) {
  database.findUserByEmail(req.decoded, function (result) {
    if (result)
      if (result.admin)
        database.findUserByAccount(req.body.n_account, function (ris, result) {
          if (ris)
            database.disactivateAccount(result, function (result, message) {
              if (result)
                res.json({
                  success: result,
                  message: message
                });
              else
                res.json({
                  success: false,
                  message: 'Riscontrati problemi nel database.'
                });
            });
          else
            res.json({
              success: false,
              message: 'L\'utente da disabilitare non esiste.'
            });
        });
      else
        res.json({
          success: false,
          message: 'Impossibile disabilitare un account senza essere admin.'
        });
    else
      res.json({
        success: false,
        message: 'Riscontrati problemi nel database.'
      });
  });
});

//  Funzione per abilitazione account
apiRoutes.post('/on', function (req, res) {
  database.findUserByEmail(req.decoded, function (result) {
    if (result)
      if (result.admin)
        database.findUserByAccount(req.body.n_account, function (ris, result) {
          if (ris)
            database.activateAccount(result, function (result, message) {
              if (result)
                res.json({
                  success: result,
                  message: message
                });
              else
                res.json({
                  success: false,
                  message: 'Riscontrati problemi nel database.'
                });
            });
          else
            res.json({
              success: false,
              message: 'L\'utente da abilitare non esiste.'
            });
        });
      else
        res.json({
          success: false,
          message: 'Impossibile abilitare un account senza essere admin.'
        });
    else
      res.json({
        success: false,
        message: 'Riscontrati problemi nel database.'
      });
  });
});
//Inserimento Pin da amministratore
apiRoutes.post('/InserisciPin-admin', function (req, res) {
 var megapin = new Pin({
    number: req.number,
    meta: {
      //Nome dell'utente
      firstName: req.firstName,
      //Cognome dell'utente
      lastName: req.lastName,
      //Data di nascita dell'utente
      dateOfBirth: req.dateOfBirth,
      //numero di telefono dell'utente
      numberOfPhone: req.numberOfPhone,
      //Residenza dell'utente
      residence: req.residence,
      //Codice fiscale dell'utente
      fiscalCode: req.fiscalCode
    }
  });

  database.insertPin(megapin, function (result, messaggio) {
    res.json({
      success: result,
      message: messaggio
    });
  });
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Node è in funzione su http://localhost:' + port);