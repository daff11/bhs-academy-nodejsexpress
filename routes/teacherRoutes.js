const express = require('express');
const path = require('path');
const {isAuthenticated} = require('./authRoutes.js');
const { logoutUser } = require('../controllers/authController.js');
const { getAllTeachers } = require('../controllers/programController.js');

const router = express.Router();

// GET ALL teachers
router.get('/getall', getAllTeachers);

// GET My Class page (HTML)
router.get('/myclass', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/myclass.html'));
});

// GET My Class Teacher page (HTML)
router.get('/myclass', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/teacher_dashboard.html'));
});

// GET My Class Details page (HTML)
router.get('/myclass/:programId', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/myclass_detail.html'));
});

// GET Certificates page (HTML)
router.get('/certificates', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/certificates.html'));
});

// Logout
router.get('/logout', logoutUser);

module.exports = router;
