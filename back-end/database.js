// ===================================================================================
// === This page consist on settings and function of the Database based on Mongodb ===
// ===================================================================================

var mongoose    = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb1";

var User;

// this function find a user from his number of account
var findByNumberOfAccount = function(numberOfAccount, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err)
        throw err;

    db.collection("users").findOne({numberOfAccount : numberOfAccount}, function(err, result) {
      if (err)
          throw err;

    db.close();

    //  Controllo di aver trovato l'utente
    if (result)
    {
      //  Chiamo la callback 
      callback(result, false);
    }
    else  //  Rispondo al front-end che qualcosa è andato storto tramite la callback
    {
      callback(result, true);
    }
    });
  });
};

// this function inizialize database and create all the collections
exports.init = function() {
  //Creation of database
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
  // Collections users
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.createCollection("users", function(err, res) {
        if (err) throw err;
        console.log("Collection users created!");
        db.close();
      });
  });
  //Collection movements
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.createCollection("movements", function(err, res) {
        if (err) throw err;
        console.log("Collection movements created!");
        db.close();
      });
  });

  User   = require('./app/models/user'); 
}

//This function find by email and password one user in Database
exports.autenticate = function(email, password, callbackRis) {
    MongoClient.connect(url, function(err, db) {
    if (err){
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    db.collection("users").findOne({email : email, password : password}, function(err, result) {
      if (err){
        callbackRis(false, "Impossibile trovare lo schema del Database");
        throw err;
      }
      db.close();

      if (!result){
        callbackRis(false, "Utente o password errati");
      }
        callbackRis(true, "Login Effettuato");
    });
  });
}

//this function insert the new user passed by server in Database
exports.addUser = function(user, callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err){
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    var myobj = user;
    db.collection("users").insertOne(myobj, function(err, res) {
      if (err){
        callbackRis(false, "Impossibile trovare lo schema del Database")
        throw err;
      }
      console.log("1 user inserted");
      db.close();
      return res;
    });
  });
}

//this function insert in DB one request of transaction arrived from server 
//and update the balance in the users record
exports.addTransaction = function(movement, callbackRis) {

  // ===== CONTO DI CHI FA IL BONIFICO ====== 
  var numberOfAccountFrom = movement.from;
  var availableBalanceFrom;
  // === CONTO DI CHI RICEVE IL BONIFICO =====
  var numberOfAccountTo = movement.to;
  var availableBalanceTo;
  // === VALORE BONIFICO ===
  var quantity = movement.quantity;

  //  Cerco l'account da cui far partire il bonifico
  findByNumberOfAccount(numberOfAccountFrom, function(result1, errore1) {
    if (errore1)
      callbackRis(false, 'Numero account inesistente.');
    else
    {
      availableBalanceFrom = (result1.availableBalance) - (quantity);

      //  Una volta trovato cerco l'account a cui far arrivare il bonifico
      findByNumberOfAccount(numberOfAccountTo, function(result2, errore2) {
        if (errore2)
          callbackRis(false, 'Numero account inesistente.');
        else
        {
          availableBalanceTo = (result2.availableBalance) + (quantity);
          
            //  ho trovato entrambi quindi aggiorno il saldo del primo
            MongoClient.connect(url, function(err, db) {
              if (err)
              {
                //  Rispondo al front-end che qualcosa è andato storto
                callbackRis(false, err);
                throw err;
              }
          
              var myquery = { numberOfAccount: numberOfAccountFrom };
              var newvalues = { availableBalance : availableBalanceFrom };
              db.collection("users").updateOne(myquery, newvalues, function(err, res) {
                if (err)
                {
                  //  Rispondo al front-end che qualcosa è andato storto
                  callbackRis(false, err);
                  throw err;
                }
          
                db.close();

                //  Aggiorno il saldo del secondo
                MongoClient.connect(url, function(err, db) {
                  if (err)
                  {
                    //  Rispondo al front-end che qualcosa è andato storto
                    callbackRis(false, err);
                    throw err;
                  }
              
                  var myquery = { numberOfAccount: numberOfAccountTo };
                  var newvalues = { availableBalance : availableBalanceTo };
                  db.collection("users").updateOne(myquery, newvalues, function(err, res) {
                    if (err)
                    {
                      //  Rispondo al front-end che qualcosa è andato storto
                      callbackRis(false, err);
                      throw err;
                    }
              
                    db.close();

                     // ====== AGGIUNTA DELLA TRANSAZIONE AL DB =======
                    MongoClient.connect(url, function(err, db) {
                      if (err)
                      {
                        //  Rispondo al front-end che qualcosa è andato storto
                        callbackRis(false, err);
                        throw err;
                      }

                      var myobj = movement;
                      db.collection("movements").insertOne(myobj, function(err, res) {
                        if (err) 
                        {
                          //  Rispondo al front-end che qualcosa è andato storto
                          callbackRis(false, err);
                          throw err;
                        }
                        console.log("1 Transaction inserted");
                        db.close();

                        //  Chiamo la callback di risposta al front-end per informarlo della transazione avvenuta
                        callbackRis(true, 'Transazione completata.');
                      });
                    });
                  });
                });
              });
            });
        }
      });
    }
  });
}