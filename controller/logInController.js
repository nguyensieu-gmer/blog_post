const passport = require("../lib/passport");
const jwt = require("jsonwebtoken");
const { jwtExpire } = require("../variables");

const postLogIn = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "login failed",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      jwt.sign(
        user,
        process.env.JWT_SECRET,
        { expiresIn: jwtExpire },
        (err, token) => {
          if (err) {
            console.error("jwt error");
            return next(err);
          }
          res.status(200).json({
            success: true,
            message: "Login successful",
            token,
          });
        },
      );
    });
  })(req, res, next);
};

module.exports = { postLogIn };
