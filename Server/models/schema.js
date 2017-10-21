var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MakeSchema = new Schema({
    schemaid : {type: String, require: true, unique: true},
    schema : { type: String, require: true }
});

module.exports = mongoose.model('makeschema', MakeSchema);