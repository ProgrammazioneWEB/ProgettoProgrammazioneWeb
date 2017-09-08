// ===================================================================================
// === This page consist on settings and function of the Database based on Mongodb ===
// ===================================================================================

var mongoose    = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb1";

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
  //Collection pins
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.createCollection("pins", function(err, res) {
      if (err) throw err;
      console.log("Collection pins created!");
      db.close();
    });
  });
  }); 
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
      callbackRis(true, "Utente Aggiunto");
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
      if(availableBalanceFrom <= 0){
        callbackRis(false, 'Soldi non disponibili');
        return;
      }
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

//this function return one user from his email
exports.findUserByEmail = function(email, callbackRis){
  MongoClient.connect(url, function(err, db) {
      if (err)  throw err;
      db.collection("users").findOne({email : email, password : password}, function(err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function return the information about user if the pin insert is correct
exports.verifyPin = function(pin, callbackRis){
   MongoClient.connect(url, function(err, db) {
    if (err)  throw err;
    db.collection("pins").findOne({number : pin}, function(err, result) {
    if (err) throw err;
    db.close();
    callbackRis(result);
    });
  });
}

//this function only can be use by administrator insert pin and the meta about user
exports.insertPin = function(pin, callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err){
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    var myobj = pin;
    db.collection("pins").insertOne(myobj, function(err, res) {
      if (err){
        callbackRis(false, "Impossibile trovare lo schema del Database")
        throw err;
      }
      console.log("1 pin and meta inserted");
      db.close();
      callbackRis(true, "Pin Aggiunto");
    });
  });
}

//this function return all the movements send about one number of account
exports.allMovementsSend = function(numberOfAccount, callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err)  throw err;
    db.collection("movements").find({ from : numberOfAccount}, function(err, result) {
    if (err) throw err;
    db.close();
    callbackRis(result);
    });
  });
}

//this function return all the movements received about one number of account
exports.allMovementsReceive = function(numberOfAccount, callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err)  throw err;
    db.collection("movements").find({ to : numberOfAccount}, function(err, result) {
    if (err) throw err;
    db.close();
    callbackRis(result);
    });
  });
}

//this function delete the record that administrator want to delete by the number of pin
exports.deleteRecordPin = function(pin){
  MongoClient.connect(url, function(err, db) {
    if (err)  throw err;
    db.collection("pins").deleteOne({number : pin}, function(err, result) {
    if (err) throw err;
    db.close();
    });
  });
}

//this function must return the max of number of account
exports.findMaxNumberOfAccount = function(callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var mysort = { numberOfAccount: -1 };
    db.collection("users").find().sort(mysort).limit(1 , function(err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function pick an email and control if the email is in the DB
exports.verifyEmail = function(email, callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err)  throw err;
    db.collection("users").findOne({email : email}, function(err, result) {
    if (err) throw err;
    db.close();
    if(result)
      //se non è salvabile torna false
    callbackRis(false);
    else
      //se è salvabile torna true
    callbackRis(true);
    });
  });
}

//this function return a list of users sort by number of account
exports.sortUsersByNumberOfAccount = function(callbackRis){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var mysort = { numberOfAccount: 1 };
    db.collection("users").find().sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}