const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  profession: { type: String, required: true },
});

module.exports = User = mongoose.model("users", UserSchema);
