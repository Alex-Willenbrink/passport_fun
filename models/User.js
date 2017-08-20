const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(passportLocalMongoose);

// virtual password hash and setter
UserSchema.virtual("password")
  .set(function(password) {
    this.passwordHash = bcrypt.hashSync(password, 12);
  })

// instance method for password validation
UserSchema.methods.validatePassword = function(password) {
  console.log(password);
  return bcrypt.compareSync(password, this.passwordHash)
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
