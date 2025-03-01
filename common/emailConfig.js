require('dotenv').config();
const nodemailer = require('nodemailer');

// Declare Env Variables here
const myEmail = process.env.email;
const myPassword = process.env.password;

// Create transporter with explicit host/port (recommended)
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,                // Use 465 for SSL
    secure: true,              // true for 465, false for 587
    auth: {
        user: myEmail,
        pass: myPassword       // This must be an App Password if using 2FA
    }
});

module.exports = transporter;
