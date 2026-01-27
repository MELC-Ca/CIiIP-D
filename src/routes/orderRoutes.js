const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Все операции с заказами требуют авторизации
router.use(authMiddleware);

router.post('/', orderController.createOrder); // Создать заказ
router.get('/', orderController.getUserOrders); // Список моих заказов
router.get('/:id', orderController.getOrderDetails); // Детали заказа (товары)

module.exports = router;