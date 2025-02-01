const jwt = require('jsonwebtoken');
const createLogs = require('../common/createPaperTrailLogs')


//Declare Env variables here
jwt_key = process.env.jwt
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



const authMiddleware = (req, res, next) => {
  // console.log(req.cookies.jwt)
  // console.log(req.headers['authorization'])
  const authHeader = req.cookies.jwt;
  if (authHeader) {
    // const token = authHeader.split(' ')[1];
    createLogs({
      route: "getuser",
      LogMessage: `Authorized access was made`,
      originalUrl: req.originalUrl,
      username: 'Not known yet',
      ip: req.ip,
      logLevel: 'info'
    });

    jwt.verify(authHeader, jwt_key, async (err, user) => {

      if (err) return res.status(403).send({ message: "User not authenticated" });
      req.user = user;
      next();
    });
  } else {
    createLogs({
      route: "getuser",
      LogMessage: `Unauthorized access was made`,
      originalUrl: req.originalUrl,
      username: 'Not known yet',
      ip: req.ip,
      logLevel: 'error'
    });
    res.status(401).send({ message: "User not authenticated" });
  }
};

module.exports = authMiddleware;