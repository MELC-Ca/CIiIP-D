const { Review, User } = require('../models');

// Добавить отзыв к товару
exports.addReview = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const { productId, text, rating } = req.body;

        if (!userId) return res.status(401).json({ message: "Необходима авторизация" });

        const review = await Review.create({
            userId,
            productId,
            text,
            rating
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить отзывы для товара
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.findAll({
            where: { productId },
            include: [{ model: User, attributes: ['email', 'first_name', 'avatar'] }] // Показываем кто написал
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};