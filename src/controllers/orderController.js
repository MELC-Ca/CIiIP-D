const { Order, OrderItem, Product } = require('../models');

// Создать новый заказ
exports.createOrder = async (req, res) => {
    try {
        // Ожидаем в body: { items: [{ productId: 1, quantity: 2 }, ...] }
        // Пользователь берется из req.user (после авторизации)
        const userId = req.user ? req.user.id : null; 
        
        if (!userId) {
            return res.status(401).json({ message: "Необходима авторизация" });
        }

        const { items } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Корзина пуста" });
        }

        // 1. Считаем общую сумму и проверяем цены
        let totalAmount = 0;
        const orderItemsData = [];

        for (let item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Товар с ID ${item.productId} не найден` });
            }
            // Здесь можно добавить проверку stock_quantity

            const price = product.price;
            totalAmount += price * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price_at_a_time: price
            });
        }

        // 2. Создаем заказ
        const order = await Order.create({
            userId: userId,
            amount: totalAmount,
            status: 'PENDING'
        });

        // 3. Создаем записи OrderItem, привязывая к order.id
        const itemsToCreate = orderItemsData.map(data => ({
            ...data,
            orderId: order.id
        }));
        
        await OrderItem.bulkCreate(itemsToCreate);

        res.status(201).json({ message: "Заказ создан", orderId: order.id, totalAmount });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить все заказы текущего пользователя
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) return res.status(401).json({ message: "Необходима авторизация" });

        const orders = await Order.findAll({
            where: { userId: userId },
            order: [['date', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить детали конкретного заказа (включая товары)
exports.getOrderDetails = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const orderId = req.params.id;

        const order = await Order.findOne({
            where: { id: orderId, userId: userId }, // Проверка, что заказ принадлежит юзеру
            include: [
                {
                    model: OrderItem,
                    include: [Product] // Вложенный include: Order -> OrderItem -> Product
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Заказ не найден" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};