require('dotenv').config()
const processImageTowebp = require('../../common/processImageTowebp')
const createLogs = require('../../common/createLogs')
const getCurrentDateTime = require('../../common/getCurrentDateTime')
const bcrypt = require('bcryptjs')
const userSchema = require('../../models/user')
const fs = require('fs');
const path = require('path');
const emailTransporter = require('../../common/emailConfig')


//Declare Env variables here
backendConnectionString = process.env.backendConnectionString
jwt_key = process.env.jwt
myEmail = process.env.email

if (!backendConnectionString || !jwt_key || !myEmail) {
  createLogs({
    route: "register",
    LogMessage: `Missing required environment variables`,
    originalUrl: 'Error Logs',
    username: 'Error Logs',
    ip: 'Error Logs'
  });
  process.exit(1);
}


const registerUser = async (req, res) => {
  try {

    if (req.file) {
      createLogs({
        route: "register",
        LogMessage: "User Profile Pic is present",
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip
      });
    } else {
      createLogs({
        route: "register",
        LogMessage: "User Profile pic is not present",
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip
      });
      return res.status(400).send({
        message: "Image is not sent"
      })
    }


    //Declare the other variables here
    //Declare Var to be used here
    let local_username = req.body.username
    let local_email = req.body.email
    let local_password = req.body.password
    let local_fullname = req.body.fullname;
    let local_dob = req.body.dob
    let local_gender = req.body.gender
    let local_aboutme = req.body.aboutme
    let local_phoneNumber = `${req.body.countryCode} ${req.body.phoneNumber}`
    let local_address = req.body.address
    let local_dtecre = getCurrentDateTime()
    let local_dtemod = getCurrentDateTime()
    let local_dteLastLogin = getCurrentDateTime()



    //Select the email from db if it exits
    const email_already_present = await userSchema.findOne({
      db_email: local_email
    })

    //Select the username from db if it exits
    const username_already_present = await userSchema.findOne({
      db_username: local_username
    })


    //Email Already Exist Code
    if (email_already_present) {
      createLogs({
        route: "register",
        LogMessage: `${local_email}'s email ${local_email} was already present`,
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip
      });
      return res.status(400).send({
        message: "Your Email is already registered"
      })
    }
    //Username Already Exist Code
    else if (username_already_present) {
      createLogs({
        route: "register",
        LogMessage: `${local_email}'s username ${local_username} was already present`,
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip
      });
      return res.status(400).send({
        message: "Your Username is already registered"
      })
    }
    else {
      //START THE REGISTRATION FUNCTIONS IF EVERYTHING IS PRESENT------------------------------------------------------------

      // Process the image (convert to WebP and resize it)
      const { webpFilename, webpFilename_100 } = await processImageTowebp(
        req.file.buffer,
        './uploads/profilePic',
        req.body.username,
        req.originalUrl,
        req.ip
      );

      if (webpFilename && webpFilename_100) {
        createLogs({
          route: "register",
          LogMessage: "Image is processed to webp successfully",
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
      } else {
        createLogs({
          route: "register",
          LogMessage: "Image is not processed to webp successfully",
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
      }

      // Build the URL to access the uploaded images
      let local_profilePicUrl = `${backendConnectionString}/uploads/profilePic/${webpFilename}`;
      let local_profilePicUrl_100 = `${backendConnectionString}/uploads/profilePic/${webpFilename_100}`;


      //Hashed Password
      const hashedPassword = await hashPassword(local_password);

      if (hashedPassword) {
        createLogs({
          route: "register",
          LogMessage: `User ${local_email}'s password has been hashed`,
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
      } else {
        createLogs({
          route: "register",
          LogMessage: `User ${local_email}'s password was not hashed`,
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
      }


      const userData = new userSchema({
        db_username: local_username,
        db_password: hashedPassword,
        db_email: local_email,
        db_fullname: local_fullname,
        db_dob: local_dob,
        db_gender: local_gender,
        db_aboutUser: local_aboutme,
        db_phoneNumber: local_phoneNumber,
        db_address: local_address,
        db_phofilePic: local_profilePicUrl,
        db_phofilePic_100: local_profilePicUrl_100,
        db_dtecre: local_dtecre,
        db_dtemod: local_dtemod,
        db_dteLastLogin: local_dteLastLogin
      });
      //Saves the data in the DB
      const result = await userData.save()
        .then(() => {
          createLogs({
            route: "register",
            LogMessage: `${local_email}'s data is saved in database.`,
            originalUrl: req.originalUrl,
            username: req.body.username,
            ip: req.ip
          });
        }).catch((err) => {
          createLogs({
            route: "register",
            LogMessage: err,
            originalUrl: req.originalUrl,
            username: req.body.username,
            ip: req.ip
          });
        });


      //Sent Email LOGIC START--------------------------------------------------------------------------
      // Load the HTML template
      const templatePath = path.join(__dirname, '../../mailTemplates/sentRegistrationMail.html');
      fs.readFile(templatePath, 'utf-8', (err, htmlTemplate) => {
        if (err) {
          createLogs({
            route: "register",
            LogMessage: `Could not read html template ${err}`,
            originalUrl: 'Error Logs',
            username: 'Error Logs',
            ip: 'Error Logs'
          });
          return;
        }

        // Replace placeholders with actual values
        htmlTemplate = htmlTemplate.replace('{{username}}', local_username);
        htmlTemplate = htmlTemplate.replace('{{date}}', getCurrentDateTime());

        const mailOptions = {
          from: myEmail,
          to: local_email,
          subject: 'Welcome to Rony Inc',
          html: htmlTemplate,
        };

        sentEmail(mailOptions, local_email, req.originalUrl, local_username, req.ip)
      })
      //Sent Email LOGIC END--------------------------------------------------------------------------


      // Send response with image URL
      res.json({
        message: `User ${local_username} has been Registered.`,
      });
    }

  } catch (err) {
    createLogs({
      route: "register",
      LogMessage: err,
      originalUrl: 'Error Logs',
      username: 'Error Logs',
      ip: 'Error Logs'
    });
    res.status(500).json({ message: err });
  }
};




// Helper function for hashing password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


//Sent Email
function sentEmail(mailOPtions, email, originalUrl, username, ip) {
  emailTransporter.sendMail(mailOPtions, (err, info) => {
    if (err) {
      createLogs({
        route: "register",
        LogMessage: `For ${email}, some error happened ${err}`,
        originalUrl: originalUrl,
        username: username,
        ip: ip
      });
    }
    else {
      createLogs({
        route: "register",
        LogMessage: `For ${email}, Mail was sent`,
        originalUrl: originalUrl,
        username: username,
        ip: ip
      });
    }
  })
}



module.exports = { registerUser };