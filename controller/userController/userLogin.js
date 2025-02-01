//const createLogs = require('../../common/createLogs')
const userSchema = require('../../models/user')
const getCurrentDateTime = require('../../common/getCurrentDateTime')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createLogs = require('../../common/createPaperTrailLogs')



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



exports.loginUser = async (req, res) => {
  try {

    //Declare Var to be used here
    let local_username = req.body.username
    let local_password = req.body.password
    let currentDateTime = getCurrentDateTime()


    //Username property of the req will have either username or password.
    //This below code checks that if the data present in username property is present in username or email field in db
    const isuUserPresent = await userSchema.findOne({
      $or: [{ db_username: local_username }, { db_email: local_username }],
    });


    //If response is returns nothing, then the code for bcrypt compare code will give error as it cannot handle if user.password is NULL
    if (!isuUserPresent) {
      createLogs({
        route: "login",
        LogMessage: `User with IP ${req.ip} tried to login but failed with username as ${local_username} and password as ${local_password}`,
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip,
        logLevel: 'error'
      });

      return res.status(400).send({
        message: "Invalid credentials"
      })
    }

    //Hashes the password in the request and compares it to the password in the db
    if (!(await bcrypt.compare(local_password, isuUserPresent.db_password))) {
      createLogs({
        route: "login",
        LogMessage: `User with IP ${req.ip} tried to login but failed with username as ${local_username} and password as ${local_password}`,
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip,
        logLevel: 'error'
      });
      return res.status(400).send({
        message: "Invalid credentials"
      })
    }


    //Update Last Login START------------------------------------------------------------------
    // Use the user's _id to identify the document to update
    const filter = { db_username: isuUserPresent.db_username };
    if (filter) {
      let lastLoginDate = await userSchema.updateOne(
        //{}condition
        filter,
        {
          //set updated data
          $set: { db_dteLastLogin: currentDateTime }
        }
      )

      if (lastLoginDate) {
        createLogs({
          route: "login",
          LogMessage: `For user ${isuUserPresent.db_username}', last Login is updated to ${currentDateTime}`,
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip,
          logLevel: 'info'
        });
      }
    }
    //Update Last Login END------------------------------------------------------------------


    if (isuUserPresent) {
      //JWT token
      const token = jwt.sign({ _id: isuUserPresent._id }, jwt_key)

      //Creates a JWT token in the cookies
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "None", // Ensure the cookie is available in cross-site requests
        secure: true,     // Send cookie only over HTTPS
        partitioned: true // Optional: For browsers supporting the Partitioned attribute
      });

      //Response is sent
      res.status(200).send({
        message: `You've successfully logged in`
      })

      createLogs({
        route: "login",
        LogMessage: `For user ${isuUserPresent.db_username}',the login response was sent`,
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip,
        logLevel: 'info'
      });
    }

  }

  catch (err) {
    createLogs({
      route: "register",
      LogMessage: err,
      originalUrl: 'Error Logs',
      username: 'Error Logs',
      ip: 'Error Logs',
      logLevel: 'error'
    });
    res.status(500).json({ message: err });
  }
};




