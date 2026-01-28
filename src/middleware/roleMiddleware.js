module.exports = function(requiredRole) {
    return (req, res, next) => {
        // authMiddleware уже должен был отработать и добавить req.user
        if (!req.user) {
            return res.status(401).json({ message: "Пользователь не авторизован" });
        }

        // Проверяем совпадает ли роль
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Нет доступа (требуется роль " + requiredRole + ")" });
        }

        next();
    };
};