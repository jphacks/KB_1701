var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const MakeSchema = require('./schema');

MakeSchema.find({"schemaid" : 1},function(err,response){
  if(err) console.log(err);
  content = response[0].content;
  // res.json({"year": year,"month": month,"day": day,"hour": hour,"minute": minute});
});

console.console.log(content);
var UserAuto = new Schema({
    content
});

module.exports = mongoose.model('userauto', UserAuto);
