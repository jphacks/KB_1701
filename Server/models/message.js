var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
    messageId : { type: String, require: true, unique: true }, 
    userId : {type: String, require: true},
    channnelId : { type: String, require: true },
    message : {type: [String], require: true}
});

module.exports = mongoose.model('message', Message);