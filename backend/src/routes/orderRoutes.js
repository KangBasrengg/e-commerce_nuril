const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/user', verifyToken, orderController.getUserOrders);
router.get('/', verifyToken, isAdmin, orderController.getAllOrders); // Admin only
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus); // Admin only

module.exports = router;
