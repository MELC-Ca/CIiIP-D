const express = require('express');
const path = require('path');

// Импортируем весь объект моделей
const db = require('./src/models'); 

// Извлекаем sequelize безопасно
const sequelize = db.sequelize;

const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();
const PORT = 3000;

// Лог для отладки (удалите после исправления ошибки)
console.log('Проверка моделей:', Object.keys(db));

app.use(express.json());

// --- ЛАБОРАТОРНАЯ РАБОТА 4: СТАТИКА ---

// Раздача статики и загрузок
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ПОДКЛЮЧЕНИЕ МАРШРУТОВ API ---
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h1>Сервер Лабораторной №4 работает!</h1>
            <p>Статика: <a href="/static/index.html">/static/index.html</a></p>
            <p>API Товаров: <a href="/products">/products</a></p>
            <p>API Категорий: <a href="/categories">/categories</a></p>
        </div>
    `);
});

// Проверяем наличие sequelize перед вызовом sync
if (sequelize) {
    sequelize.sync({ force: false }) 
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