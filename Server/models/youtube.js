var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Youtube = new Schema({
    musicid : {type: String, require: true, unique: true},
    url : { type: String, require: true },
    title: {type: String, require: true},
    userid : {type: String, require: true}
});

module.exports = mongoose.model('youtube', Youtube);