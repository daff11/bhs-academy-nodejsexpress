const express = require('express');
const path = require('path');
const {isAuthenticated} = require('./authRoutes.js');
const { getAllUsers, getUserById } = require('../controllers/userController.js');
const { logoutUser } = require('../controllers/authController.js');
const { getChaptersByProgramId, markChapterAsComplete } = require('../controllers/chapterController.js');

const router = express.Router();

// GET User Data ALL
router.get('/getall', getAllUsers);

// GET User Data (by session)
router.get('/gets', getUserById);

// GET My Class page (HTML)
router.get('/myclass', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/myclass.html'));
});

// GET My Class Details page (HTML)
router.get('/myclass/:programId', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/myclass_detail.html'));
});

// GET Certificates page (HTML)
router.get('/certificates', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/certificates.html'));
});

//GET Chapters 
router.get('/myclass/chapter/:programId', isAuthenticated, getChaptersByProgramId);

//POST Mark As Complete
router.post('/myclass/mark-complete', isAuthenticated, markChapterAsComplete);

//GET Payments History Page (HTML)
router.get('/payments-history', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/payments.html'));
});

// Logout
router.get('/logout', logoutUser);

module.exports = router;
