document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById('year');
    yearSpan.textContent = new Date().getFullYear();
    
    console.log("Страница портфолио успешно загружена!");
});