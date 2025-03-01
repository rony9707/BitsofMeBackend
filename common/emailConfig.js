const nodemailer = require('nodemailer')
require("dotenv").config();

//Declare Env Variables here
myEmail = process.env.email
myPassword = process.env.password


//mail config
let config = {
  service: 'gmail',
  auth: {
    user: myEmail,
    pass: myPassword
  }
}

let transporter = nodemailer.createTransport(config)


module.exports = transporter;