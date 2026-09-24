// ==========================================
// TELEGRAM
// ==========================================

const tg = window.Telegram?.WebApp;

// Сообщаем Telegram, что приложение готово
if (tg) {
    tg.ready();

    // Раскрываем WebApp на максимальную высоту
    tg.expand();
}


// ==========================================
// SCORE
// ==========================================

const scoreElement = document.getElementById("score");
const clickButton = document.getElementById("clickButton");
const resetButton = document.getElementById("resetButton");
const greetingElement = document.getElementById("greeting");


// Получаем сохранённый счёт
let score = Number(localStorage.getItem("clicker-score")) || 0;


// Показываем счёт
function updateScore() {
    scoreElement.textContent = score;
}


// ==========================================
// USER
// ==========================================

if (tg?.initDataUnsafe?.user) {

    const user = tg.initDataUnsafe.user;

    greetingElement.textContent =
        `Привет, ${user.first_name}!`;

} else {

    greetingElement.textContent =
        "Привет! Ты открыл кликер в браузере 👋";
}


// ==========================================
// CLICK
// ==========================================

clickButton.addEventListener("click", (event) => {

    score++;

    // Сохраняем счёт
    localStorage.setItem(
        "clicker-score",
        score
    );

    updateScore();


    // Анимация числа
    createFloatingNumber(
        event.clientX,
        event.clientY
    );


    // Анимация счёта
    scoreElement.classList.remove("pop");

    // Небольшая задержка нужна,
    // чтобы браузер заново запустил animation
    void scoreElement.offsetWidth;

    scoreElement.classList.add("pop");


    // Лёгкая вибрация в Telegram
    if (tg?.HapticFeedback) {

        tg.HapticFeedback.impactOccurred("light");

    }

});


// ==========================================
// FLOATING +1
// ==========================================

function createFloatingNumber(x, y) {

    const element = document.createElement("div");

    element.className = "floating-number";

    element.textContent = "+1";

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    document.body.appendChild(element);


    setTimeout(() => {
        element.remove();
    }, 700);
}


// ==========================================
// RESET
// ==========================================

resetButton.addEventListener("click", () => {

    const confirmed = confirm(
        "Сбросить весь прогресс?"
    );

    if (!confirmed) {
        return;
    }

    score = 0;

    localStorage.removeItem(
        "clicker-score"
    );

    updateScore();


    if (tg?.HapticFeedback) {

        tg.HapticFeedback.notificationOccurred(
            "success"
        );

    }

});


// ==========================================
// TELEGRAM THEME
// ==========================================

function updateTelegramTheme() {

    if (!tg) {
        return;
    }

    const backgroundColor =
        tg.themeParams?.bg_color;

    if (!backgroundColor) {
        return;
    }

    // Очень простое определение светлой темы
    const isLight =
        isColorLight(backgroundColor);

    document.body.classList.toggle(
        "telegram-light",
        isLight
    );
}


function isColorLight(color) {

    const hex = color.replace("#", "");

    if (hex.length !== 6) {
        return false;
    }

    const r = parseInt(
        hex.substring(0, 2),
        16
    );

    const g = parseInt(
        hex.substring(2, 4),
        16
    );

    const b = parseInt(
        hex.substring(4, 6),
        16
    );

    const brightness =
        (r * 299 +
         g * 587 +
         b * 114) / 1000;

    return brightness > 160;
}


updateTelegramTheme();
updateScore();
