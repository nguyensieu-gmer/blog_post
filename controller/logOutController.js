const postLogOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json({
      message: "Log out successful",
    });
  });
};

module.exports = { postLogOut };
