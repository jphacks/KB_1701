const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Timer = new Schema({
    year : { type: Number, require: true },
    month   : { type: Number, require: true },
    day   : { type: Number, require: true },
    hour   : { type: Number, require: true },
    minute   : { type: Number, require: true }
});

module.exports = mongoose.model('timer', Timer);
