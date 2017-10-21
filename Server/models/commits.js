var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Commits = new Schema({
  name : {type:String,require:true,unique:true},
  commit:[{
    sha:String,
    comment:String,
    name:String,
    time:String,
    additions:Number,
    deletions:Number,
    total:Number
  }]
});

module.exports = mongoose.model('commits',Commits);
