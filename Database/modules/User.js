var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  gender: String,
  username: String,
  email: String,
  password: String,
  userType: String,
  dob: Date,
  people: [String],
  currentAmiraId: String
});

module.exports = mongoose.model("User", UserSchema);
