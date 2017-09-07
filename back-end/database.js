// ==================================================================================
// ===This page consist on settings and function of the Database based on Mongodb ===
// ==================================================================================

var mongoose    = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

var User;

//this function inizialize database and create all the collections
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
exports.autenticate = function(email, password) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    db.collection("users").findOne({email : email, password : password}, function(err, result) {
      if (err) throw err;

      db.close();

      if (!result)
        return false;

      return true;
    });
  });
}

//this function insert the new user passed by server in Database
exports.addUser = function(user){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = user;
    db.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 user inserted");
      db.close();
      return res;
    });
  });
}

//this function insert in DB one request of transaction arrived from server 
//and update the balance in the users record
exports.addTransaction = function(movement){

  // ===== CONTO DI CHI FA IL BONIFICO ====== 
  var numberOfAccountFrom = movement.from;
  var quantityToPick = movement.quantity;
  var userFrom = database.findByNumberOfAccount(numberOfAccountFrom);
  var availableBalanceFrom = (userFrom.availableBalance) - (quantityToPick);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myquery = { numberOfAccount: numberOfAccountFrom };
    var newvalues = { availableBalance : availableBalanceFrom };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });

  // === CONTO DI CHI RICEVE IL BONIFICO =====
  var numberOfAccountTo = movement.to;
  var quantityToGive = movement.quantity;
  var userTo = database.findByNumberOfAccount(numberOfAccountTo);
  var availableBalanceTo = (userTo.availableBalance) + (quantityToGive);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myquery = { numberOfAccount: numberOfAccountTo };
    var newvalues = { availableBalance : availableBalanceTo };
    db.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });

  // ====== AGGIUNTA DELLA TRANSAZIONE AL DB =======
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = movement;
    db.collection("movements").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 Transaction inserted");
      db.close();
    });
  });
}

//this function find an user by the numberOfAccount
exports.findByNumberOfAccount = function(numberOfAccount){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("users").findOne({numberOfAccount : numberOfAccount}, function(err, result) {
    if (err) throw err;
    db.close();
    return result;
    });
  });
};