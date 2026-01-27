const sequelize = require('../database');
const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const Review = require('./Review');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// --- Связи Категорий и Товаров ---
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// --- Связи Отзывов ---
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// --- Связи Заказов ---
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Заказ состоит из множества позиций (OrderItem)
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Позиция заказа ссылается на конкретный товар
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    sequelize,
    Category,
    Product,
    User,
    Review,
    Order,
    OrderItem
};