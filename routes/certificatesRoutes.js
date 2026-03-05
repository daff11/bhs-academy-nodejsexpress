// certificatesRoutes.js
const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('./authRoutes.js');
const { getAllCertificates, downloadCertificates, createCertificates } = require('../controllers/certificateController.js');

// GET All Certificates
router.get('/get', isAuthenticated, getAllCertificates);

// CREATE Certificates
router.post('/create', isAuthenticated, createCertificates);

// Generate sertifikat PDF
router.get('/download/:id', isAuthenticated, downloadCertificates);

module.exports = router;

