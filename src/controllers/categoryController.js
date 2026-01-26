// Контроллер для работы с категориями
const { Category } = require('../models');

// Получить все категории
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Создать новую категорию
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Удалить категорию (Этот метод был пропущен, что вызывало ошибку в роутах)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Category.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.json({ message: "Категория удалена" });
        } else {
            res.status(404).json({ message: "Категория не найдена" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};