const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LiveInfo = new Schema({
    peerID : { type: String, require: true }, 
    room   : { type: String, require: true },
    area   : { type: String },
    open   : { type: Date,   default: Date.now, require: true}
});

module.exports = mongoose.model('liveInfo', LiveInfo);
