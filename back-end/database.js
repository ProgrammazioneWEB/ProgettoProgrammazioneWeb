var mongoose    = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

var User;

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

  User   = require('./app/models/user'); // Forse inutile -------- 
}

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

exports.add = function(user){
  //Inserimento del Correntista
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