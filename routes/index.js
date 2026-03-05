// routes/index.js
const express = require('express');
const path = require('path');

const router = express.Router();

// Rute utama (/)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/index.html')); // Render dashboard jika login
});

module.exports = router;
