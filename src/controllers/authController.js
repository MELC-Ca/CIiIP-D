const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../config');
const crypto = require('crypto'); // Встроенный модуль Node.js
const { Op } = require('sequelize'); // Операторы для сравнения дат

// Регистрация
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Введите имя пользователя, email и пароль" });
        }

        // Проверяем, есть ли такой пользователь (по имени или email)
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [{ username }, { email }] 
            } 
        });
        
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь с таким именем или email уже существует" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.create({
            username,
            email,
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

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Неверные учетные данные" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверные учетные данные" });
        }

        const payload = { id: user.id, username: user.username };
        const token = jwt.encode(payload, config.jwtSecret);

        res.json({ token: `Bearer ${token}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Запрос на восстановление пароля
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // В целях безопасности можно отвечать "Если email существует, мы отправили письмо",
            // но для лабы скажем честно
            return res.status(404).json({ message: "Пользователь с таким email не найден" });
        }

        // Генерируем случайный токен (20 байт в hex)
        const token = crypto.randomBytes(20).toString('hex');

        // Устанавливаем токен и срок действия (1 час = 3600000 мс)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        await user.save();

        // В реальном проекте здесь отправляется письмо через nodemailer.
        // Для лабы мы просто выведем ссылку в консоль сервера и вернем токен в ответе.
        const resetLink = `http://localhost:3000/auth/reset-password/${token}`;
        console.log(`\n--- ССЫЛКА ДЛЯ СБРОСА ПАРОЛЯ: ${resetLink} ---\n`);

        res.json({ 
            message: "Ссылка для сброса пароля сгенерирована (смотри консоль сервера)", 
            resetToken: token // Возвращаем токен для удобства тестирования в Postman
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Сброс пароля
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Ищем пользователя по токену и проверяем, что срок действия не истек
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Op.gt означает "больше чем сейчас"
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Токен недействителен или истек срок его действия" });
        }

        // Хешируем новый пароль
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(newPassword, salt);

        // Очищаем поля токена
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: "Пароль успешно изменен! Теперь вы можете войти с новым паролем." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};