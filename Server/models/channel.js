var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Channel = new Schema({
    channelId : {type: String, require: true, unique: true},
    channelName : { type: String, require: true },
});

module.exports = mongoose.model('channel', Channel);