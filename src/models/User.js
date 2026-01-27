const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING, // Ссылка на файл изображения
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'USER' // USER или ADMIN
    },
    // Поля для логики активации (из схемы)
    activationLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // Поля для восстановления пароля
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;