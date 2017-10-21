var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MakeSchema = new Schema({
    schemaid : {type: String, require: true, unique: true},
    content : { type: Object, require: true }
});

module.exports = mongoose.model('makeschema', MakeSchema);