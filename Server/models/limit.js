var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Limit = new Schema({
    limitid : {type: String, require: true, unique: true},
    year : { type: String, require: true }, 
    month : { type: String, require: true},
    day : {type: String, require: true},
    hour : {type: String, require: true},
    minute : {type: String, require: true},
});

module.exports = mongoose.model('limit', Limit);