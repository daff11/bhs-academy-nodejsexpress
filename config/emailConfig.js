// emailConfig.js
const nodemailer = require('nodemailer');

console.log('Creating transporter...');
const transporter = nodemailer.createTransport({
  host: 'mail.bogorhospitalityjournal.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true, 
  port: 465,
  family: 4,
});

console.log('Verifying transporter...');
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Connection successful:', success);
  }
});

module.exports = transporter;
