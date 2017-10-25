var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    userid : {type: String, require: true, unique: true},
    username : { type: String, require: true }, 
    team : { type: String},
    area : {type: String},
    githubAccount : {type: String},
    specialty : {type: String},
    tobacco : {type: Boolean}
});

module.exports = mongoose.model('user', User);