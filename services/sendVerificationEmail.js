//sendVerificationEmail.js
const crypto = require('crypto');
const transporter = require('../config/emailConfig.js');

const sendVerificationEmail = async (user) => {
  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.HOST_URL}/auth/verify-email?token=${verificationToken}`;
    console.log('Verification URL:', verificationUrl); // Log URL

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Email pengirim
      to: user.email,                // Email tujuan
      subject: 'Email Verification',
      html: `<p class="text-color">Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    };

    console.log('Mail options:', mailOptions); // Log opsi email

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = sendVerificationEmail;
