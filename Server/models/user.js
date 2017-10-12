var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    userId : {type: String, require: true, unique: true},
    userName : { type: String, require: true }, 
    password : { type: String, require: true },
    area : {type: String},
    githubAccount : {type: String, require: true},
    specialty : {type: String, require: true},
    tobacco : {type: Boolean}

});

module.exports = mongoose.model('user', User);