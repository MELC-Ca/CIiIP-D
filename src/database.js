const { Sequelize } = require('sequelize');

// Подключаемся к SQLite базе данных
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Файл БД будет создан в корне проекта
    logging: false // Отключаем лишний лог SQL запросов в консоль, чтобы было чище
});

module.exports = sequelize;