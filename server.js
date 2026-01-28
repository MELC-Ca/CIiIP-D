const express = require('express');
const path = require('path');

// Импортируем весь объект моделей
const db = require('./src/models'); 

// Извлекаем sequelize безопасно
const sequelize = db.sequelize;

const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes'); // Новый роут
const reviewRoutes = require('./src/routes/reviewRoutes'); // Новый роут

const app = express();
const PORT = 3000;

app.use(express.json());

// Раздача статики и загрузок
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ПОДКЛЮЧЕНИЕ МАРШРУТОВ API ---
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/upload', uploadRoutes);
app.use('/orders', orderRoutes); // /orders
app.use('/reviews', reviewRoutes); // /reviews

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h1>Сервер Интернет-магазина работает!</h1>
            <p>Статика: <a href="/static/index.html">/static/index.html</a></p>
            <p>API Товаров (с пагинацией): <a href="/products?page=1&limit=5">/products</a></p>
            <p>API Категорий: <a href="/categories">/categories</a></p>
            <p>API Заказов: /orders (нужен токен)</p>
        </div>
    `);
});

// При изменении структуры моделей (добавление таблиц, полей)
// используем alter: true. (или force: true если бд уронил)
// Если возникнут ошибки совместимости со старыми данными, используйте force: true (СБРОСИТ ВСЕ ДАННЫЕ)
if (sequelize) {
    sequelize.sync({ force: true }) 
        .then(() => {
            console.log('Database connected & tables synced!');
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
} else {
    console.error('ОШИБКА: Sequelize не найден в объекте моделей. Проверьте src/models/index.js');
}