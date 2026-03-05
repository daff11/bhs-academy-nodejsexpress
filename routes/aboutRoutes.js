const express = require('express');
const path = require('path');

const router = express.Router();

// About-Us
router.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/about.html'));
});

// FAQ
router.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/faq.html'));
});

module.exports = router;
