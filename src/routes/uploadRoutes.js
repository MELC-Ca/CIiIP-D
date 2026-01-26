const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST запрос на /upload
// Сначала работает middleware multer (загружает файл), потом наш метод контроллера (отдает JSON)
router.post('/', uploadController.uploadMiddleware, uploadController.uploadFile);

module.exports = router;