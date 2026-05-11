const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Create QRIS payment (authenticated)
router.post('/create-qris', verifyToken, paymentController.createQRISPayment);

// Check payment status (authenticated)
router.get('/status/:orderId', verifyToken, paymentController.checkPaymentStatus);

// Xendit webhook (no auth - called by Xendit servers)
router.post('/webhook', paymentController.xenditWebhook);

module.exports = router;
