const jwt = require('jwt-simple');
const config = require('../config');
const { User } = require('../models');

module.exports = async (req, res, next) => {
    try {
        // 1. Получаем токен из заголовка Authorization
        // Ожидается формат: "Bearer <token>"
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: "Токен не предоставлен" });
        }

        // Разделяем "Bearer" и сам токен
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Ошибка формата токена" });
        }

        // 2. Декодируем токен
        const decoded = jwt.decode(token, config.jwtSecret);

        // 3. Проверяем, существует ли пользователь (опционально, но надежно)
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        // 4. Добавляем пользователя в req, чтобы использовать в контроллерах
        req.user = user;
        
        // 5. Пропускаем дальше
        next();

    } catch (error) {
        return res.status(401).json({ message: "Неверный или истекший токен" });
    }
};