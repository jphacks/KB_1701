var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
    teamId : {type: String, require: true, unique: true},
    teamName : { type: String, require: true }, 
    repoName : { type: String, require: true },
    userIdList : {type: [String], require: true}
});

module.exports = mongoose.model('team', Team);