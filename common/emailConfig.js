require('dotenv').config();
const nodemailer = require('nodemailer');

// Declare Env Variables here
const myEmail = process.env.email;
const myPassword = process.env.password;


// Create transporter with explicit host/port (recommended)
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,  // Try 587 if 465 fails
  secure: false,  // Must be false for STARTTLS
  auth: {
    user: process.env.email,
    pass: process.env.password
  },
  logger: true,  // Log all SMTP traffic
  debug: true    // More verbose output
});


module.exports = transporter;
