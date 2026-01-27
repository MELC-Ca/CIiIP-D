const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../config');
const crypto = require('crypto');

// Регистрация
exports.register = async (req, res) => {
    try {
        // Мы убрали username, теперь основные поля - это email, first_name, last_name
        const { email, password, first_name, last_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email и пароль обязательны" });
        }

        // Проверяем по email
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь с таким email уже существует" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.create({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            role: 'USER' // Значение по умолчанию
        });

        res.status(201).json({ message: "Пользователь зарегистрирован", userId: user.id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Вход (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Логинимся по email!

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный пароль" });
        }

        // В токен зашиваем id и email
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.encode(payload, config.jwtSecret);

        res.json({ token: `Bearer ${token}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Восстановление пароля
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const token = crypto.randomBytes(20).toString('hex');
        
        // В новой модели поле называется resetToken (без Expires для упрощения, или добавь поле в модель)
        user.resetToken = token;
        await user.save();

        console.log(`\n--- ССЫЛКА СБРОСА: http://localhost:3000/auth/reset-password/${token} ---\n`);

        res.json({ message: "Ссылка отправлена в консоль", resetToken: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({ where: { resetToken: token } });

        if (!user) {
            return res.status(400).json({ message: "Неверный токен" });
        }

        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(newPassword, salt);
        user.resetToken = null;
        await user.save();

        res.json({ message: "Пароль успешно изменен" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};