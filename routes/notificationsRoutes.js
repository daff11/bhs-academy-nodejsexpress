const express = require('express');
const path = require('path');
const isAuthenticated = require('./authRoutes.js');
const { getNotificationCount, getAllNotifications, markNotificationAsRead } = require('../controllers/notificationsController.js');

const router = express.Router();

router.get('/getall', getAllNotifications);

router.get('/count', getNotificationCount);

router.patch('/mark-as-read/:id', markNotificationAsRead);

module.exports = router;
