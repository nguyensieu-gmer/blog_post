const AuthenticationError = require("../error/AuthenticationError");
const jwt = require("jsonwebtoken");

function verityToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      console.error("Failed to verify token");
      return res.sendStatus(401).json({ message: "Failed to verify token" });
    }
  } else {
    console.error("Unverify token");
    throw new AuthenticationError("You need to login to use this service.");
  }
}

module.exports = verityToken;
