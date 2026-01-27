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
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // Теперь email обязателен
        unique: true,
        validate: {
            isEmail: true // Проверка формата email
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Поля для восстановления пароля
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = User;