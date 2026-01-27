const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, // Для длинных описаний лучше TEXT
        allowNull: true
    },
    image: {
        type: DataTypes.STRING, // Путь к файлу
        allowNull: true
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
    // categoryId добавляется автоматически через связи
});

module.exports = Product;