const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); 
const checkRole = require('../middleware/roleMiddleware'); // Добавляем импорт

// Публичные маршруты
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Защищенные маршруты: Просмотр/создание требует авторизации, 
// но изменение данных — только для АДМИНА
router.post('/', authMiddleware, checkRole('ADMIN'), productController.createProduct);
router.put('/:id', authMiddleware, checkRole('ADMIN'), productController.updateProduct);
router.delete('/:id', authMiddleware, checkRole('ADMIN'), productController.deleteProduct);

module.exports = router;