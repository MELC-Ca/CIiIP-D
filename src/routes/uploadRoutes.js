const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Разрешаем загрузку файлов только админам
router.post('/', 
    authMiddleware, 
    checkRole('ADMIN'), 
    uploadController.uploadMiddleware, 
    uploadController.uploadFile
);

module.exports = router;