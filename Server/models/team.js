var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
    teamId : {type: String, require: true, unique: true},
    teamName : { type: String, require: true }, 
    repoName : { type: String, require: true },
    user : []
});

module.exports = mongoose.model('team', Team);