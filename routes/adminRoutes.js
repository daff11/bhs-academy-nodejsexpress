// routes/authRoutes.js
const express = require('express');
const path = require('path');
const { loginUser, logoutUser, registerUser, verifyEmail, loginPengajar, registerPengajar, loginAdmin } = require('../controllers/authController.js');
const { isAuthenticated } = require('./authRoutes.js');
const router = express.Router(); 

// GET Dashboard Page
router.get('/dashboard', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_dashboard.html');
    res.sendFile(filePath);
});

// GET Programs Page
router.get('/programs', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_programs.html');
    res.sendFile(filePath);
});

// GET Lessons Page
router.get('/lessons', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_lessons.html');
    res.sendFile(filePath);
});

// GET Prospects Page
router.get('/prospects', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_prospects.html');
    res.sendFile(filePath);
});

// GET Teachers Page
router.get('/teachers', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_teachers.html');
    res.sendFile(filePath);
});

// GET Payments Page
router.get('/payments', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_payments.html');
    res.sendFile(filePath);
});

// GET Users Page
router.get('/users', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/admin_users.html');
    res.sendFile(filePath);
});

router.get('/adminbhs-login', (req, res) => {
    const filePath = path.join(__dirname, '../frontend/theme/adminLogin.html');
    res.sendFile(filePath);
})

module.exports = router;
