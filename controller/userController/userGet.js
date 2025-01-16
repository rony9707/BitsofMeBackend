const userSchema = require('../../models/user')
const createLogs = require('../../common/createMongoLogs')


exports.getUser = async (req, res) => {
  try {
    const local_userId = req.user._id;

    const user = await userSchema.findOne({ _id: local_userId })

    if (!user) {
      return res.status(401).send({ message: 'User not found' }); 
    }
    
    createLogs({
      route: "getuser",
      LogMessage: `Request was made for ${local_userId}`,
      originalUrl: req.originalUrl,
      username: user.db_username,
      ip: req.ip,
      logLevel: 'info'
    });

    const { db_password,_id,__v, ...userdata } = await user.toJSON()

    res.send(userdata)
    createLogs({
      route: "getuser",
      LogMessage: `Request that was made for ${local_userId} was sent`,
      originalUrl: req.originalUrl,
      username: user.db_username,
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
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


