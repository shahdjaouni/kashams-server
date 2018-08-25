var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HalqaSchema = new Schema({
  name: String,
  teacher: String,
  students:[String],
  time:String,
  place: String
  });

module.exports = mongoose.model('Halqa', HalqaSchema);
