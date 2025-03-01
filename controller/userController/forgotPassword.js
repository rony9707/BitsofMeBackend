const userSchema = require('../../models/user')
const createLogs = require('../../common/createPaperTrailLogs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const emailTransporter = require('../../common/emailConfig')
const nodemailer = require('nodemailer')


jwt_key = process.env.jwt
frontEndConnectionString = process.env.frontEndConnectionString
myEmail = process.env.email
myPassword = process.env.password


exports.forgotpassword = async (req, res) => {
  try {
    //This below code userSchema that if the data present in username property is present in username or email field in db
    const user = await userSchema.findOne({
      db_email: req.body.email
    });
    // bitsofm33@gmail.com

    //If response is returns nothing, then the code for bcrypt compare code will give error as it cannot handle if user.password is NULL
    if (!user) {
      return res.status(400).send({
        message: "Incorrect email"
      })
    }

    //User exist amd mpw create a One time link and valid for 15 min
    const secret = jwt_key
    const payload = {
      email: user.db_email,
      username: user.db_username
    }

    const token = jwt.sign(payload, secret, { expiresIn: '15m' })

    const link = `${frontEndConnectionString}/reset-password/${user.db_username}/${token}`
    //Sent Email LOGIC START--------------------------------------------------------------------------
    // Load the HTML template
    const templatePath = path.join(__dirname, '../../mailTemplates/forgetPassword.html');
    fs.readFile(templatePath, 'utf-8', (err, htmlTemplate) => {
      if (err) {
        console.log(err)
        return;
      }

      // Replace placeholders with actual values
      htmlTemplate = htmlTemplate.replace('{{username}}', user.db_username);
      htmlTemplate = htmlTemplate.replace('{{link}}', link);

      //mail config
      let config = {
        service: 'gmail',
        auth: {
          user: myEmail,
          pass: myPassword
        }
      }

      //let transporter = nodemailer.createTransport(config)

      const mailOptions = {
        from: myEmail,
        to: user.db_email,
        subject: 'Bits of M3 Forget Password link',
        html: htmlTemplate,
      };

      let transporter = nodemailer.createTransport(config)

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {

        }
        else {
          // Send response
          res.json({
            message: `The Forget Password Link has been sent to your email. The Link will be valid for 15 min`,
          });
        }
      })

      //sentEmail(mailOptions)


    })
    //Sent Email LOGIC END--------------------------------------------------------------------------
  }
  catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


//Sent Email
function sentEmail(mailOPtions) {
  emailTransporter.sendMail(mailOPtions, (err, info) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log("mail was sent")
    }
  })
}
