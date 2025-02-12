const jwt = require('jsonwebtoken');
const createLogs = require('../common/createPaperTrailLogs');
const User = require('../models/user'); // Import the User model

// Declare Env variables here
const jwt_key = process.env.jwt;
if (!jwt_key) {
  createLogs({
    route: "register",
    LogMessage: `Missing required environment variables`,
    originalUrl: 'Error Logs',
    username: 'Error Logs',
    ip: 'Error Logs',
    logLevel: 'error'
  });
  process.exit(1);
}

const authMiddleware = async (req, res, next) => {
  const authHeader = req.cookies.jwt;
  const requestUsername = req.headers['x-username']; // Get username from headers

  if (!authHeader) {
    createLogs({
      route: "getuser",
      LogMessage: `Unauthorized access was made`,
      originalUrl: req.originalUrl,
      username: 'Unknown',
      ip: req.ip,
      logLevel: 'error'
    });
    return res.status(401).send({ message: "User not authenticated" });
  }

  try {
    const decoded = jwt.verify(authHeader, jwt_key);
    const user = await User.findById(decoded._id);

    if (!user) {
      createLogs({
        route: "getuser",
        LogMessage: `User not found in database`,
        originalUrl: req.originalUrl,
        username: 'Unknown',
        ip: req.ip,
        logLevel: 'error'
      });
      return res.status(403).send({ message: "User not authenticated" });
    }

    // Check if the username matches
    if (user.username !== requestUsername) {
      createLogs({
        route: "getuser",
        LogMessage: `Username mismatch: JWT and request header do not match`,
        originalUrl: req.originalUrl,
        username: requestUsername,
        ip: req.ip,
        logLevel: 'error'
      });
      return res.status(403).send({ message: "Invalid user credentials" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    createLogs({
      route: "getuser",
      LogMessage: `JWT verification failed`,
      originalUrl: req.originalUrl,
      username: 'Unknown',
      ip: req.ip,
      logLevel: 'error'
    });
    return res.status(403).send({ message: "User not authenticated" });
  }
};

module.exports = authMiddleware;
