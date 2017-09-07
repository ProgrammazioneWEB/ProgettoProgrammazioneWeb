//Creazione dello schema del modello user
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    //L'email con cui accederà l'utente 
    email : {
        type : String,
        required : true,
        unique : true
    },
    //La password con cui accederà l'utente
    password : {
        type : String,
        required : true
    },
    //boolean che indica l'admin
    admin : {
        type : Boolean,
        default : false,
    },
    //Dati personali dell'utente
    meta : {
        //Nome dell'utente
        firstName : {
            type : String,
            required : true
        },
        //Cognome dell'utente
        lastName : {
            type : String,
            required : true
        },
        //Data di nascita dell'utente
        dateOfBirth : {
            type : Date,
            required : true
        },
        //numero di telefono dell'utente
        numberOfPhone : {
            type: Number,
            required : true
        },
        //Residenza dell'utente
        residence : {
            type : String
        },
        //Codice fiscale dell'utente
        fiscalCode : {
            type : String,
            unique : true
        }
    },
    //Numero di conto dell'utente
    numberOfAccount : {
        type : Number,
        required : true,
        unique : true
    },
    //Saldo conto
    availableBalance : {
        type : Number,
        required : true,
        default : 0
    },

});

//Dichiarazione del modello ("costruttore") dello user
module.exports = mongoose.model('User', user);

