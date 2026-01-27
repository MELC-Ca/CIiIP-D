const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    amount: {
        type: DataTypes.FLOAT, // Общая сумма заказа
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING, // PENDING, PAID, SHIPPED, etc.
        defaultValue: 'PENDING'
    }
    // userId добавится через связи
});

module.exports = Order;