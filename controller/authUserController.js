const isAuth = require("../lib/isAuth");

const getAuthenticatedUser = [
  isAuth,
  (req, res) => {
    res.json(req.user);
  },
];

module.exports = { getAuthenticatedUser };
