const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: { // Обычно в отзывах есть рейтинг, добавим для полноценности
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: { min: 1, max: 5 }
    }
    // userId и productId добавятся через связи
});

module.exports = Review;