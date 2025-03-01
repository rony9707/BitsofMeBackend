const fs = require('fs');
const path = require('path');
const userSchema = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const getCurrentDateTime = require('../../common/getCurrentDateTime');
const emailTransporter = require('../../common/emailConfig');
const nodemailer = require('nodemailer')

require('dotenv').config();

const jwt_key = process.env.jwt;
const myEmail = process.env.email;
const myPassword = process.env.password


exports.resetPassword = async (req, res) => {
  let responseSent = false;

  try {
    const { password, token } = req.body;
    // Verify JWT token to get the username
    const decoded = jwt.verify(req.body.token, jwt_key);
    local_username = decoded.username


    if (!local_username) return;  // If already responded, stop further execution

    const user = await userSchema.findOne({ db_username: local_username });

    if (!user) {
      return res.status(400).send({ message: "Invalid credentials error which came for Password Update" });
    }

    if (await bcrypt.compare(password, user.db_password)) {
      return res.status(400).send({ message: "Old password cannot be the new password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const filter = { db_username: user.db_username };
    await userSchema.updateOne(filter, {
      $set: {
        db_password: hashedPassword,
        db_dtemod: getCurrentDateTime()
      }
    });

    // Send email
    const templatePath = path.join(__dirname, '../../mailTemplates/resetPassword.html');
    fs.readFile(templatePath, 'utf-8', (err, htmlTemplate) => {
      if (err) {
        console.log(err);
      } else {

        htmlTemplate = htmlTemplate.replace('{{username}}', user.db_username);

        //mail config
        let config = {
          service: 'gmail',
          auth: {
            user: myEmail,
            pass: myPassword
          }
        }

        const mailOptions = {
          from: myEmail,
          to: user.db_email,
          subject: 'Bits of M3 Rony Inc Password Reset Successful',
          html: htmlTemplate,
        };

        let transporter = nodemailer.createTransport(config)

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(400).send({
              message: err
            })
          }
          else {
            // Send response
            res.json({
              message: `Password has been updated successfully`,
            });
          }
        })

        //sendEmail(mailOptions);
      }
    });

  } catch (error) {
    if (!responseSent) {
      res.status(500).json({ message: 'An error occurred during password reset.' });
    }
  }
};

function sendEmail(mailOptions) {
  emailTransporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Email send error:", err);
    } else {
      console.log("Email was sent successfully");
    }
  });
}
