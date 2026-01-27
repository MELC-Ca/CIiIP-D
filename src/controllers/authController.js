const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../config');

// Регистрация
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Введите имя пользователя и пароль" });
        }

        // Проверяем, есть ли такой пользователь
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
        }

        // Хешируем пароль
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword =bcrypt.hashSync(password, salt);

        // Создаем пользователя
        const user = await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: "Пользователь успешно зарегистрирован", userId: user.id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Вход (Login)
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Ищем пользователя
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Неверные учетные данные" });
        }

        // Сравниваем пароли
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверные учетные данные" });
        }

        // Генерируем токен
        const payload = {
            id: user.id,
            username: user.username
        };
        const token = jwt.encode(payload, config.jwtSecret);

        res.json({ token: `Bearer ${token}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};