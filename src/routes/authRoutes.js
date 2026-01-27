const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Маршруты восстановления пароля
router.post('/forgot-password', authController.forgotPassword); // Запрос сброса
router.post('/reset-password/:token', authController.resetPassword); // Установка нового пароля

module.exports = router;