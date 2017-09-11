// ======================================
// ======== Advise Schema =============
// ======================================

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var advise = new Schema({
    title : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    date : {
        type : Date,
    }
});

module.exports = mongoose.model('Advise', advise);