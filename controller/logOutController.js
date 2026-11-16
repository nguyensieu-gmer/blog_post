const postLogOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.json({
      message: "Log out successful",
    });
  });
};

module.exports = { postLogOut };
