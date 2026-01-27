const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // Импортируем защиту

// Публичные маршруты (доступны всем)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Защищенные маршруты (нужен токен)
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;