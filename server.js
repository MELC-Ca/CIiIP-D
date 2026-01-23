const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON тела запроса
app.use(express.json());


// Структура товара: { id: 1, name: "Товар", price: 100 }
let products = [
    { id: 1, name: 'Laptop', price: 1500 },
    { id: 2, name: 'Mouse', price: 20 }
];

// Вспомогательная переменная для генерации ID
let nextId = 3;

// 1. Получение списка всех товаров
app.get('/products', (req, res) => {
    res.json(products);
});

// 2. Получение товара по id
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

// 3. Добавление товара в каталог
app.post('/products', (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Необходимо указать name и price' });
    }

    const newProduct = {
        id: nextId++,
        name,
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Изменение товара по id
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        // Обновляем поля, если они переданы, иначе оставляем старые
        products[productIndex] = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            price: price || products[productIndex].price
        };
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

// 5. Удаление товара по id
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        res.json({ message: 'Товар удален', product: deletedProduct[0] });
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});