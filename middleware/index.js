
module.exports = {
  loggedInOnly: (req, res, next) => {
    return req.isAuthenticated() ? res.redirect("/") : next();
  },

  loggedOutOnly: (req, res, next) => {
    return !req.isAuthenticated() ? res.redirect("/") : next();
  }
}
