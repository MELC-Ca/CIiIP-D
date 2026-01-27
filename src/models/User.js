const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Имя пользователя должно быть уникальным
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
    // Можно добавить role: DataTypes.STRING, если нужны админы
});

module.exports = User;