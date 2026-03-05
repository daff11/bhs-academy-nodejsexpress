// routes/authRoutes.js
const express = require('express');
const path = require('path');
const { loginUser, logoutUser, registerUser, verifyEmail, loginPengajar, registerPengajar, loginAdmin, sendResetPasswordEmail, requestResetPassword, resetPassword } = require('../controllers/authController.js');

const router = express.Router(); 

// Middleware untuk mengecek apakah user sudah login
function isAuthenticated(req, res, next) {
    try {
        console.log('Session username:', req.session.username);
        console.log('User authenticated with userId:', req.session.userId);
        if (req.session && req.session.userId) {
            return next(); // Lanjutkan jika session ada
        }
        return res.redirect('/');
    } catch (err) {
        console.error('Error in isAuthenticated:', err);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

router.get('/get-user-session', (req, res) => {
    if (req.session && req.session.userId) {
        return res.status(200).json({ success: true, userId: req.session.userId });
    }
    res.status(401).json({ success: false, message: 'User not authenticated.' });
});


// Route untuk Register
router.post('/register', registerUser);

// Route untuk Verify Email
router.get('/verify-email', verifyEmail);

// Route untuk Halaman Verify Success
router.get('/verify-success', (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/verify-success.html');
    res.sendFile(filePath);
});

//Route untuk Halaman Forgot Password
router.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/forgot-password.html'));
});
// Route untuk Halaman Reset Password (dari email link)
router.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/reset-password.html'));
});


//Route request reset pass POST
router.post('/request-reset-password', requestResetPassword);

//Route reset pass POST
router.post('/reset-password', resetPassword);

// Rute untuk login POST
router.post('/login', loginUser);

// Rute untuk logout
router.post('/logout', logoutUser);

// POST Login Pengajar
router.post('/login-teacher', loginPengajar);

// POST Register Pengajar
router.post('/register-teacher', registerPengajar);

//POST Admin
router.post('/login-admin', loginAdmin);

const sessionTimeout = 30 * 60 * 1000; // Timeout 30 menit (dalam milidetik)

router.get('/check-status', (req, res) => {
    const now = Date.now();
    console.log(req.session.username);
    console.log(req.session.userId);
    if (req.session.username && (now - req.session.lastActivity < sessionTimeout)) {
        req.session.lastActivity = now; // Update waktu aktivitas terakhir
        return res.status(200).json({ loggedIn: true, user: { name: req.session.username } });
    } else {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ loggedIn: false, message: 'Error ending session' });
            }
            return res.status(401).json({ loggedIn: false });
        });
    }
});

// Route untuk get captcha key dari backend
router.get('/captcha-site-key', (req, res) => {
    const siteKey = process.env.CAPTCHA_SITE_KEY;
    if (siteKey) {
        res.json({ siteKey });
    } else {
        res.status(500).json({ error: 'Site key not configured' });
    }
});

module.exports = {
    router,
    isAuthenticated
  };
