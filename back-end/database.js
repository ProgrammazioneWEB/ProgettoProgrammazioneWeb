// ===================================================================================
// === This page consist on settings and function of the Database based on Mongodb ===
// ===================================================================================

var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dbTest010";

// this function find a user from his number of account
var findByNumberOfAccount = function (numberOfAccount, callback) {
  MongoClient.connect(url, function (err, db) {
    if (err)
      throw err;

    db.collection("users").findOne({ numberOfAccount: numberOfAccount }, function (err, result) {
      if (err)
        throw err;

      db.close();

      //  Controllo di aver trovato l'utente
      if (result) {
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
exports.init = function () {
  //Creation of database
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
    // Collections users
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.createCollection("users", function (err, res) {
        if (err) throw err;
        console.log("Collection users created!");
        db.close();
      });
    });
    //Collection movements
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.createCollection("movements", function (err, res) {
        if (err) throw err;
        console.log("Collection movements created!");
        db.close();
      });
    });
    //Collection pins
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.createCollection("pins", function (err, res) {
        if (err) throw err;
        console.log("Collection pins created!");
        db.close();
      });
    });
    //Collection advises
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.createCollection("advises", function (err, res) {
        if (err) throw err;
        console.log("Collection advises created!");
        db.close();
      });
    });
  });
}

//This function find by email and password one user in Database
exports.autenticate = function (email, password, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    db.collection("users").findOne({ email: email, password: password, active: true }, function (err, result) {
      if (err) {
        callbackRis(false, "Impossibile trovare lo schema del Database");
        throw err;
      }
      db.close();

      if (!result)
        callbackRis(false, "Utente o password errati");
      else
        callbackRis(true, "Login Effettuato");
    });
  });
}

//this function insert the new user passed by server in Database
exports.addUser = function (user, callbackRis) {

  if (!user)  //  Controllo che l'utente che sto per aggiungere non sia null
  {
    callbackRis(false, "Impossibile registrare un utente che non esiste");
    return;
  }

  if (user.admin == undefined)
    user.admin = false;

  if (user.active == undefined)
    user.active = true;

  if (user.availableBalance == undefined)
    user.availableBalance = 0;

  if (user.image == undefined)
    user.image = "";

  if (user.dateOfCreation == undefined) {
    var date = new Date();
    var today = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();

    user.date = today;
  }

  MongoClient.connect(url, function (err, db) {
    if (err) {
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    var myobj = user;
    db.collection("users").insertOne(myobj, function (err, res) {
      if (err) {
        callbackRis(false, "Impossibile trovare lo schema del Database")
        throw err;
      }
      db.close();
      console.log("1 user inserted");
      callbackRis(true, "Utente Aggiunto");
    });
  });
}

//this function insert in DB one request of transaction arrived from server 
//and update the balance in the users record
exports.addTransaction = function (movement, callbackRis) {

  // ===== CONTO DI CHI FA IL BONIFICO ====== 
  var numberOfAccountFrom = movement.from;
  var availableBalanceFrom;
  // === CONTO DI CHI RICEVE IL BONIFICO =====
  var numberOfAccountTo = movement.to;
  var availableBalanceTo;
  // === VALORE BONIFICO ===
  var quantity = movement.quantity;
  // === PERSONE COINVOLTE ===
  var userFrom;
  var userTo;

  //  Cerco l'account da cui far partire il bonifico
  findByNumberOfAccount(numberOfAccountFrom, function (result1, errore1) {
    if (errore1)
      callbackRis(false, 'Numero account inesistente.');
    else {
      availableBalanceFrom = (result1.availableBalance) - (quantity);
      if (availableBalanceFrom <= 0) {
        callbackRis(false, 'Soldi non disponibili');
        return;
      }
      //  Salvo i dati dell' utente
      userFrom = result1;
      //  Una volta trovato cerco l'account a cui far arrivare il bonifico
      findByNumberOfAccount(numberOfAccountTo, function (result2, errore2) {
        if (errore2)
          callbackRis(false, 'Numero account inesistente.');
        else {
          availableBalanceTo = (result2.availableBalance) + (quantity);

          //  Salvo i dati dell' utente
          userTo = result2;

          //  ho trovato entrambi quindi aggiorno il saldo del primo
          MongoClient.connect(url, function (err, db) {
            if (err) {
              //  Rispondo al front-end che qualcosa è andato storto
              callbackRis(false, err);
              throw err;
            }

            var myquery = { numberOfAccount: numberOfAccountFrom };
            //  new values
            userFrom.availableBalance = availableBalanceFrom;
            db.collection("users").updateOne(myquery, userFrom, function (err, res) {
              if (err) {
                //  Rispondo al front-end che qualcosa è andato storto
                callbackRis(false, err);
                throw err;
              }

              db.close();

              //  Aggiorno il saldo del secondo
              MongoClient.connect(url, function (err, db) {
                if (err) {
                  //  Rispondo al front-end che qualcosa è andato storto
                  callbackRis(false, err);
                  throw err;
                }

                var myquery = { numberOfAccount: numberOfAccountTo };
                // new values
                userTo.availableBalance = availableBalanceTo;
                db.collection("users").updateOne(myquery, userTo, function (err, res) {
                  if (err) {
                    //  Rispondo al front-end che qualcosa è andato storto
                    callbackRis(false, err);
                    throw err;
                  }

                  db.close();

                  // ====== AGGIUNTA DELLA TRANSAZIONE AL DB =======
                  MongoClient.connect(url, function (err, db) {
                    if (err) {
                      //  Rispondo al front-end che qualcosa è andato storto
                      callbackRis(false, err);
                      throw err;
                    }

                    var myobj = movement;
                    db.collection("movements").insertOne(myobj, function (err, res) {
                      if (err) {
                        //  Rispondo al front-end che qualcosa è andato storto
                        callbackRis(false, err);
                        throw err;
                      }
                      console.log("Transaction inserted");
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
exports.findUserByEmail = function (email, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("users").findOne({ email: email }, function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function return the information about user if the pin insert is correct
exports.verifyPin = function (pin, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("pins").findOne({ number: pin }, function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function only can be use by administrator insert pin and the meta about user
exports.insertPin = function (pin, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    var myobj = pin;
    db.collection("pins").insertOne(myobj, function (err, res) {
      if (err) {
        callbackRis(false, "Impossibile trovare lo schema del Database")
        throw err;
      }
      db.close();
      callbackRis(true, "Pin Aggiunto");
    });
  });
}

//this function return all the movements send about one number of account
exports.allMovementsSend = function (numberOfAccount, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("movements").find({ from: numberOfAccount }).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function return all the movements received about one number of account
exports.allMovementsReceive = function (numberOfAccount, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("movements").find({ to: numberOfAccount }).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function delete the record that administrator want to delete by the number of pin
exports.deleteRecordPin = function (pin) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("pins").deleteOne({ number: pin }, function (err, result) {
      if (err) throw err;
      db.close();
    });
  });
}

//this function must return the max of number of account
exports.findMaxNumberOfAccount = function (callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var mysort = { numberOfAccount: -1 }; //  -1 vale come ORDER BY DESC
    db.collection("users").find().sort(mysort).limit(1).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function pick an email and control if the email is in the DB
exports.verifyEmail = function (email, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("users").findOne({ email: email }, function (err, result) {
      if (err) throw err;
      db.close();
      if (result)
        //se non è salvabile torna false
        callbackRis(false);
      else
        //se è salvabile torna true
        callbackRis(true);
    });
  });
}

//this function return a list of users sort by number of account
exports.sortUsersByNumberOfAccount = function (callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var mysort = { numberOfAccount: 1 };
    db.collection("users").find().sort(mysort).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function insert an advise on the database advises
exports.addAdvise = function (advise, callbackRis) {
  if (!advise)  //  Controllo che l'advise che sto per aggiungere non sia null
  {
    callbackRis(false, "Impossibile registrare un avviso che non esiste");
    return;
  }

  MongoClient.connect(url, function (err, db) {
    if (err) {
      callbackRis(false, "Impossibile connettersi al Database");
      throw err;
    }
    var myobj = advise;
    db.collection("advises").insertOne(myobj, function (err, res) {
      if (err) {
        callbackRis(false, "Impossibile trovare lo schema del Database")
        throw err;
      }
      db.close();
      console.log("1 advise inserted");
      callbackRis(true, "Avviso Aggiunto");
    });
  });
}

//this function return the last five advises based on date in the database
exports.returnLastFiveAdvises = function (callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var mysort = { date: 1 };
    //limito il sort degli avvisi ai primi 5 risultati in maniera dal più grande al più piccolo
    //ordinati per data così che nella richiesta della home compariranno i 5 più recenti avvisi
    db.collection("advises").find().sort(mysort).limit(5).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      callbackRis(result);
    });
  });
}

//this function activate an user account
exports.activateAccount = function (user, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var myquery = { numberOfAccount: user.numberOfAccount };
    var myobj = user;
    myobj.active = true;
    db.collection("users").updateOne(myquery, myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callbackRis(true, 'Document modify');
    });
  });
}

//this function disactivate an user account
exports.disactivateAccount = function (user, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var myquery = { numberOfAccount: user.numberOfAccount };
    var myobj = user;
    myobj.active = false;
    db.collection("users").updateOne(myquery, myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callbackRis(true, 'Document modify');
    });
  });
}

//this function return the media of the cash sent in transaction
exports.avgCashOutside = function (numberOfAccount, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("movements").aggregate([
      {
        $group:
        {
          _id: { from: numberOfAccount },
          avgQuantity: { $avg: quantity }

        }
      }
    ], function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callbackRis(res);
    });
  });
}

//this function modify the user in collections users
exports.modifyCredential = function (user, email, password, phone, residence, callbackRis) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var myquery = { email: user.email, password: user.password };
    var myobj = user;

    //Controllo se email è definita, se è definita lo sostituisco nell'utente
    if (email != undefined)
      myobj.email = email;

    //Controllo se password è definita, se è definita la sostituisco nell'utente
    if (password != undefined)
      myobj.password = password;

    //Controllo se phone è definita, se è definita lo sostituisco nell'utente
    if (phone != undefined)
      myobj.meta.numberOfPhone = phone;

    //Controllo se residence è definita, se è definita la sostituisco nell'utente
    if (residence != undefined)
      myobj.meta.residence = residence;

    db.collection("users").updateOne(myquery, myobj, function (err, res) {

      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callbackRis(true, 'Document modify');
    });
  });
}