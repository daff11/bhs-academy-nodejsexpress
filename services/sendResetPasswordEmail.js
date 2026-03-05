//sendResetPasswordEmail.js
const crypto = require('crypto');
const transporter = require('../config/emailConfig.js');

const sendResetPasswordEmail = async (user) => {
  try {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = resetToken; // pakai field yg sama
    await user.save();

    const resetUrl = `${process.env.HOST_URL}/auth/reset-password?token=${resetToken}`;
    console.log('Reset Password URL:', resetUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = sendResetPasswordEmail;
