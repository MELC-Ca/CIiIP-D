const { Product, Category } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        // Параметры запроса: 
        // page - номер страницы (по умолчанию 1)
        // limit - количество товаров на странице (по умолчанию 10)
        // categoryId - фильтр по категории
        
        let { page, limit, categoryId } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let offset = (page - 1) * limit;

        // Формируем условия поиска
        let whereOptions = {};
        if (categoryId) {
            whereOptions.categoryId = categoryId;
        }

        // findAndCountAll возвращает { count: общее_кол-во, rows: [массив_товаров] }
        const data = await Product.findAndCountAll({
            where: whereOptions,
            limit: limit,
            offset: offset,
            include: Category // Подгружаем данные категории
        });

        res.json({
            totalItems: data.count,
            totalPages: Math.ceil(data.count / limit),
            currentPage: page,
            products: data.rows
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: Category });
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedProduct = await Product.findByPk(req.params.id);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await Product.destroy({ where: { id: req.params.id } });
        if (result) res.json({ message: 'Product deleted' });
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};