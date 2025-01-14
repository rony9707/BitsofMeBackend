const createLogs = require('../../common/createLogs')

exports.logoutUser = async (req, res) => {
  try {
    const local_userId = req.user._id;
    createLogs({
      route: "logout",
      LogMessage: `User ${local_userId} is trying to log out`,
      originalUrl: req.originalUrl,
      username: req.body.username,
      ip: req.ip
    });
    
    res.cookie("jwt", "", { maxAge: 0 })

    res.send({
      message: "You have successfully logged out"
    })

    createLogs({
      route: "logout",
      LogMessage: `User ${local_userId} logged out`,
      originalUrl: req.originalUrl,
      username: req.body.username,
      ip: req.ip
    });
  }
  catch (err) {
    createLogs({
      route: "getuser",
      LogMessage: err,
      originalUrl: 'Error Logs',
      username: 'Error Logs',
      ip: 'Error Logs'
    });
    res.status(500).json({ message: 'An error occurred during logout.' });
  }
};

