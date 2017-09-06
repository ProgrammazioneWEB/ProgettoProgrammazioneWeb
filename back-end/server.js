// ============================
// = get the packages we need =
// ============================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cookieParser = require('cookie-parser'); 

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

// =======================
// ==== configuration ====  Guarda che scritta cool che ho fatto marà, so figo io mica te
// =======================
var port = 3001 || process.env.PORT; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable (prelevata da config.js)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));// in realtà non serve ad un cazzo, l'ho copiato da un tutorial scarso

// use cookie parse to save the token in your browser anus
app.use(cookieParser());

// Enabling CORS (sono i permessi per essere acceduti da server web con porta e/o indirizzo diverso)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //  accetto tutte le origini
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// =======================
// routes ================
// =======================

// basic route (momentaneamente solo di test)
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

//  Setta l'utente, al momento in modo statico (serve una pagina di registrazione front-end)
app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    name: 'nicolo95r@gmail.com', 
    password: 'password',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// route to authenticate a user
app.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
      name: req.body.name
    }, function(err, user) {
  
      if (err) throw err;
  
      // forse è meglio se raggruppo in un unico errore per evitare di dare troppe info a possibili hacker (manco fosse un sito vero)
      if (!user) { 
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
  
        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
  
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, app.get('superSecret'));
  
          // Salvo il token nel browser del utente autenticato (sotto il nome di authToken)
          res.cookie('authToken',token);          

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Assaggia il mio token, ASSAGGIAMELO.',
            token: token
          });
        }   
  
      }
  
    });
  });
  
  // route middleware to verify a token
  app.use("/api/*", function(req, res, next) {
    
      // check header or url parameters or post parameters or cookie 
      var token = req.headers['token']; //req.cookies.authToken; req.body.token || req.query.token || 

      console.log(token);

      // decode token
      if (token) {
    
        // verifies secret and checks exp (controllo che non sia tarocco)
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes (non so esattamente cosa fa)
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

    //  in realtà le api erano gestite da un router express che ho dovuto togliere (dovrei rimetterlo ma crasha tutto diocane)

// route to show a random message (GET http://localhost:8080/api/)
app.post('/api', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
app.post('/api/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Node è in funzione su http://localhost:' + port);
