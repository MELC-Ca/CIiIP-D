const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price_at_a_time: { // Цена товара на момент покупки (важно!)
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
    // orderId и productId добавятся через связи
});

module.exports = OrderItem;