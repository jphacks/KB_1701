var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = new Schema({
    id : {type: String,require: true,unique: true},
    slack : {type: String, require: true,unique: true},
    github : { type: String, require: true },
});

module.exports = mongoose.model('accesstoken', AccessToken);