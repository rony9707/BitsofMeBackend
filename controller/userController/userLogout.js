const createLogs = require('../../common/createPaperTrailLogs')

exports.logoutUser = async (req, res) => {
  try {
    const local_userId = req.user._id;

    createLogs({
      route: "logout",
      LogMessage: `User ${local_userId} is trying to log out`,
      originalUrl: req.originalUrl,
      username: local_userId,
      ip: req.ip,
      logLevel: 'info'
    });
    
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0, // Set to 0 to expire immediately
      sameSite: "None",
      secure: true,
      partitioned: true
    });

    res.send({
      message: "You have successfully logged out"
    })

    createLogs({
      route: "logout",
      LogMessage: `User ${local_userId} logged out`,
      originalUrl: req.originalUrl,
      username: local_userId,
      ip: req.ip,
      logLevel: 'info'
    });
  }
  catch (err) {
    createLogs({
      route: "getuser",
      LogMessage: err,
      originalUrl: 'Error Logs',
      username: 'Error Logs',
      ip: 'Error Logs',
      logLevel: 'error'
    });
    res.status(500).json({ message: 'An error occurred during logout.' });
  }
};

