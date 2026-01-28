const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); 

// Все операции с заказами требуют авторизации
router.use(authMiddleware);

// --- Маршруты для ОБЫЧНОГО пользователя ---
router.post('/', orderController.createOrder); // Создать заказ
router.get('/', orderController.getUserOrders); // Список моих заказов
router.get('/:id', orderController.getOrderDetails); // Детали моего заказа

// --- Маршруты для АДМИНИСТРАТОРА ---
// этот маршрут должен идти ВЫШЕ чем /:id, 
// иначе сервер может принять слово 'admin' за ID заказа
router.get('/admin/all', checkRole('ADMIN'), orderController.getAllOrders);

module.exports = router;