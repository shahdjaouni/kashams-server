var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
  
  text: String,
	image:String
 });

module.exports = mongoose.model('News', NewsSchema);
