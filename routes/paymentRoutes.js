// routes/paymentRoutes.js
const express = require('express');
const { 
    createTransaction, 
    getProgramPurchaseByUserId, 
    handlePaymentNotification, 
    validateMidtransWebhook, 
    getPreloadPayment 
} = require('../controllers/paymentController.js');
const {isAuthenticated} = require('./authRoutes.js');
const path = require('path');

const router = express.Router();

// Route untuk membuat transaksi pembayaran
router.post('/create-transactions/:programId', isAuthenticated, createTransaction);

// Webhook untuk menerima notifikasi pembayaran dari Midtrans
router.post('/notification', validateMidtransWebhook, handlePaymentNotification);

// Route getProgramPurchase by userID
router.get('/getprogramuserid', getProgramPurchaseByUserId);

//Ambil client key di .env
router.get('/get-client-key', (req, res) => {
    const clientKey = process.env.CLIENT_KEY;
    res.json({ clientKey });
});

// GET payment Waiting page (HTML)
router.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/payment-waiting.html'));
});

// GET payment Success page (HTML)
router.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme/payment-success.html'));
});

//preload payment info
router.get('/get-default-payment/:programId', getPreloadPayment);


module.exports = router;