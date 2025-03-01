const userSchema = require('../../models/user')
const createLogs = require('../../common/createPaperTrailLogs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


jwt_key = process.env.jwt

exports.getResetPassword = async (req, res) => {
  const { username, token } = req.params;
  // Your password reset logic here...

  // Assuming the reset password logic is successful
  const response = {
    username: username,
    token: token,
    message: 'Password reset link received successfully.'
  };

  const user = await userSchema.findOne({
    db_username: response.username
  });

  if (!user) {
    return res.status(400).send({
      message: "Invalid Email"
    })
  }

  if (response.username != user.db_username) {
    res.send('Invalid username')
  }

  //We have a valud id and we have valid use with this id
  const secret = jwt_key

  try {
    jwt.verify(response.token, secret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.send({
            message: err.name
          })
        } else {
          res.send({
            message: err.name
          })
        }
      } else {
      }
    });

    res.send({
      message: "Success",
      response
    })
  } catch (err) {
    res.status(500).send({ message: err });
  }
};


