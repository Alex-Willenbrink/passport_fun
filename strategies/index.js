const LocalStrategy = require("passport-local").Strategy;
const {User} = require("../models");

module.exports = {

  local: new LocalStrategy(async function(username, password, done) {
    try {
      const user = await User.findOne({username: username});
      if (!user)
        throw new Error("Error: Couldn't find user in database");
      if (!user.validatePassword(password))
        throw new Error("Error: Invalid password");
      done(null, user);
    } catch (err) {
      done(err);
    }
  }),

  // Need these to persist users in sessions
  serializeUser: function(user, done) {
    done(null, user.id)
  },

  deserializeUser: function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    })
  }
}
