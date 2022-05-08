const jwt = require("jsonwebtoken");
const config = require("config");

const auth = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const payload = jwt.verify(token, config.get("jwtKey"));
    req.user = payload;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

module.exports = auth;
