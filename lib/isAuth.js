const AuthenticationError = require("../error/AuthenticationError");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    throw new AuthenticationError(
      "You need to authenticate to use this service!",
    );
  }
};
module.exports = isAuth;
