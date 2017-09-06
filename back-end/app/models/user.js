// ==================================
// ======== User Schema =============
// ==================================

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({ 
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    admin : {
        type : Boolean,
        default : false,
    },
    meta : {
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        dateOfBirth : {
            type : Date,
            required : true
        },
        numberOfPhone : {
            type: Number,
            required : true
        },
        residence : {
            type : String
        },
        fiscalCode : {
            type : String,
            unique : true
        }
    },
    numberOfAccount : {
        type : Number,
        required : true,
        unique : true
    },
    availableBalance : {
        type : Number,
        required : true,
        default : 0
    },

});

module.exports = mongoose.model('User', user);

