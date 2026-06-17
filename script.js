// 📋 Список предметов с путями к картинкам
const weapons = [
    { en: "Sword",  ru: "Меч",    img: "images/sword.png"  },
    { en: "Dagger", ru: "Кинжал", img: "images/dagger.png" },
    { en: "Knife",  ru: "Нож",    img: "images/knife.png"  },
    { en: "Axe",    ru: "Топор",  img: "images/axe.png"    },
    { en: "Spear",  ru: "Копьё",  img: "images/spear.png"  },
    { en: "Bow",    ru: "Лук",    img: "images/bow.png"    },
    { en: "Shield", ru: "Щит",    img: "images/shield.png" },
    { en: "Mace",   ru: "Булава", img: "images/mace.png"   }
];

let selectedWord = null;
let score = 0;
let foundCount = 0;

// 🎯 Запуск игры
function initGame() {
    score = 0;
    foundCount = 0;
    selectedWord = null;

    document.getElementById('score').textContent = score;
    document.getElementById('found').textContent = foundCount;
    document.getElementById('total').textContent = weapons.length;
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';

    renderWords();
    renderItems();
}

// 📝 Создание кнопок со словами
function renderWords() {
    const list = document.getElementById('words-list');
    list.innerHTML = '';
    weapons.forEach(w => {
        const btn = document.createElement('button');
        btn.className = 'word-btn';
        btn.textContent = w.en;
        btn.dataset.word = w.en;
        btn.onclick = () => selectWord(btn, w.en);
        list.appendChild(btn);
    });
}

// 🎨 Размещение предметов на сцене
function renderItems() {
    const scene = document.getElementById('scene');
    scene.innerHTML = '';
    const sceneW = scene.clientWidth;
    const sceneH = scene.clientHeight;

    weapons.forEach(w => {
        const item = document.createElement('div');
        item.className = 'item';
        item.dataset.word = w.en;

        // Случайная позиция (с отступами 10px от краёв)
        const x = Math.random() * (sceneW - 100) + 10;
        const y = Math.random() * (sceneH - 100) + 10;
        item.style.left = x + 'px';
        item.style.top  = y + 'px';

        // Картинка предмета
        const img = document.createElement('img');
        img.src = w.img;
        img.alt = w.ru;
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/80?text=' + w.en;
        };
        item.appendChild(img);

        item.onclick = () => clickItem(item, w);
        scene.appendChild(item);
    });
}

// 🔤 Игрок выбирает слово
function selectWord(btn, word) {
    if (btn.classList.contains('found')) return;

    document.querySelectorAll('.word-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedWord = word;

    speak(word);
    showMessage(`Find: ${word}`, 'success');
}

// 🖱️ Игрок кликнул по предмету
function clickItem(item, weapon) {
    if (item.classList.contains('found')) return;

    if (selectedWord === weapon.en) {
        // ✅ Правильно!
        item.classList.add('found');
        foundCount++;
        score += 10;

        document.getElementById('score').textContent = score;
        document.getElementById('found').textContent = foundCount;

        const btn = document.querySelector(`.word-btn[data-word="${weapon.en}"]`);
        btn.classList.remove('selected');
        btn.classList.add('found');

        showMessage(`✅ Correct! +10 points`, 'success');
        selectedWord = null;

        // Проверка победы
        if (foundCount === weapons.length) {
            setTimeout(() => {
                showMessage(`🏆 YOU WIN! Total score: ${score}`, 'win');
            }, 700);
        }
    } else {
        // ❌ Неверно
        item.classList.add('wrong');
        setTimeout(() => item.classList.remove('wrong'), 400);
        score = Math.max(0, score - 2);
        document.getElementById('score').textContent = score;
        showMessage(`❌ This is ${weapon.en} (${weapon.ru})`, 'error');
    }
}

// 💬 Показать сообщение
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;
}

// 🔊 Озвучить слово
function speak(text) {
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.9;
        speechSynthesis.speak(utter);
    }
}

// 🔄 Кнопка новой игры
document.getElementById('restart-btn').onclick = initGame;

// 🚀 Старт
window.onload = initGame;