const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Убедимся, что папка uploads существует
// Если её нет, скрипт создаст её автоматически при первом запуске
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Настройка хранилища Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка, куда сохранять файлы
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла: дата + случайное число + расширение
        // Это предотвращает перезапись файлов с одинаковыми именами
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Инициализация multer с настроенным хранилищем
const upload = multer({ storage: storage });

// Middleware для обработки одного файла (поле формы должно называться 'file')
exports.uploadMiddleware = upload.single('file');

// Метод контроллера для ответа клиенту после загрузки
exports.uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Пожалуйста, загрузите файл' });
        }

        // Формируем JSON ответ с информацией о загруженном файле
        res.json({
            message: "Файл загружен",
            file: {
                originalName: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                // Ссылка, по которой можно открыть файл (обслуживается через express.static)
                url: `/uploads/${req.file.filename}`
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};