
module.exports = {
  loggedInOnly: (req, res, next) => {
    if(req.user) {
      return res.redirect("/")
    }
    return next();
  },

  loggedOutOnly: (req, res, next) => {
    if(!req.user) {
      return res.redirect("/")
    }
    return next();
  }
}
