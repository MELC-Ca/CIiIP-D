const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/product/:productId', reviewController.getProductReviews); // Читать отзывы могут все
router.post('/', authMiddleware, reviewController.addReview); // Писать - только авторизованные

module.exports = router;