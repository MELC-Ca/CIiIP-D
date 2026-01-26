const sequelize = require('../database');
const Category = require('./Category');
const Product = require('./Product');

// Настройка связи "Один ко многим"
// Одна категория имеет много товаров
Category.hasMany(Product, { foreignKey: 'categoryId' });
// Товар принадлежит одной категории
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
    sequelize,
    Category,
    Product
};