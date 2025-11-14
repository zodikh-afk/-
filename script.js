/* ============================================================
      БАЗОВЫЕ ДАННЫЕ КОЛОДЫ
============================================================ */

const suits = [
  { symbol: '♥', color: 'red' },
  { symbol: '♦', color: 'red' },
  { symbol: '♣', color: 'black' },
  { symbol: '♠', color: 'black' }
];

const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function randomCard() {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return { value, suit };
}

function cardValue(v) {
  if (v === 'A') return 11;     // можно потом сделать динамический ace
  if (v === 'K') return 10;
  if (v === 'Q') return 10;
  if (v === 'J') return 10;
  return parseInt(v);
}

/* ============================================================
      ГЛОБАЛЬНЫЕ ДАННЫЕ
============================================================ */

let players = {};

/* ============================================================
      СОЗДАНИЕ ПОЛЯ БЕЗ КАРТ
============================================================ */

function createBlackjackLayout(numPlayers) {
  const container = document.getElementById("blackjack-game");
  container.innerHTML = "";  // очистка всего поля
  players = {};

  for (let i = 1; i <= numPlayers; i++) {
    container.innerHTML += `
      <div class="player">
        <h2>Игрок ${i}</h2>
        <div class="deck" id="deck${i}">
        </div>
      </div>
    `;
  }
}

/* ============================================================
      ДОБАВИТЬ ОДНУ КАРТУ
============================================================ */

function addCardToPlayer(player, card) {
  const deck = document.getElementById(`deck${player}`);

  const slot = document.createElement("div");
  slot.className = "card-slot";

  slot.innerHTML = `
    <div class="card-inner">
        <div class="card-face card-back"><span class="back-symbol">🂠</span></div>
        <div class="card-face card-front"></div>
    </div>
  `;

  deck.appendChild(slot);

  const inner = slot.querySelector(".card-inner");
  const front = slot.querySelector(".card-front");

  // Настройка лицевой стороны
  front.className = `card-face card-front ${card.suit.color}`;
  front.innerHTML = `
      <div class="corner top">${card.value}<br>${card.suit.symbol}</div>
      <div class="center">${card.suit.symbol}</div>
      <div class="corner bottom">${card.value}<br>${card.suit.symbol}</div>
  `;

  // flip-анимация
  setTimeout(() => inner.classList.add("flip"), 50);
}

/* ============================================================
      РАЗДАЧА ДВУХ КАРТ
============================================================ */

function dealBlackjack(numPlayers) {
  players = {}; // сброс данных
  let delay = 0;
  const step = 600;

  // 📌 раздаём 2 карты каждому
  for (let r = 1; r <= 2; r++) {
    for (let p = 1; p <= numPlayers; p++) {
      const card = randomCard();
      if (!players[p]) players[p] = [];
      players[p].push(card);

      setTimeout(() => addCardToPlayer(p, card), delay);
      delay += step;
    }
  }

  // после раздачи — показать победителя
  setTimeout(() => evaluateBlackjack(numPlayers), delay + 150);
}

/* ============================================================
      ОЦЕНКА ПОБЕДИТЕЛЯ (по сумме карт)
============================================================ */

function evaluateBlackjack(numPlayers) {
  const resultDiv = document.getElementById("result");
  const scores = [];

  for (let p = 1; p <= numPlayers; p++) {
    const total = players[p].reduce((sum, c) => sum + cardValue(c.value), 0);
    scores.push({ player: p, total });
  }

  const max = Math.max(...scores.map(s => s.total));
  const winners = scores.filter(s => s.total === max);

  if (winners.length === 1) {
    resultDiv.textContent = `🏆 Победил Игрок ${winners[0].player}! (Очки: ${max})`;
    resultDiv.style.color = "lime";
  } else {
    resultDiv.textContent = `🤝 Ничья! (Очки: ${max})`;
    resultDiv.style.color = "white";
  }
}

/* ============================================================
      ЗАПУСК ПО КНОПКЕ
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBlackjack");
  if (startBtn) {
    // при загрузке создаём пустое поле
    createBlackjackLayout(2);

    // при нажатии — очистить + новая раздача
    startBtn.onclick = () => {
      document.getElementById("result").textContent = "";
      createBlackjackLayout(2);     // очищаем стол
      dealBlackjack(2);             // новая раздача
    };
  }
});
