const sequelize = require('../database');
const Category = require('./Category');
const Product = require('./Product');
const User = require('./User'); // Добавляем импорт

// Настройка связи "Один ко многим"
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Экспортируем все модели
module.exports = {
    sequelize,
    Category,
    Product,
    User
};