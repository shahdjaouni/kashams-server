var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  gender: String,
  username: String,
  email:String,
  password:String,
  dob: Date,
  isAmira: Boolean,
  people:[String],
  currentAmiraId: String,
  isAdmin: Boolean

});

module.exports = mongoose.model('User', UserSchema);
