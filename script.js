const icons = [
  "https://i.imgur.com/xDZQ5dH.jpg",
  "https://i.imgur.com/9Pet8B3.jpg",
  "https://i.imgur.com/PDUWW9q.jpg",
  "https://i.imgur.com/pO3bFOn.jpg",
  "https://i.imgur.com/bwNt2Uv.jpg",
  "https://i.imgur.com/EYe3bmY.jpg",
  "https://i.imgur.com/OdzIlpf.jpg",
  "https://i.imgur.com/Qj50kbC.jpg",
];

let selectedCards = [];
let matchedCards = [];
let moves = 0;
let timerInterval = null;
let secondsElapsed = 0;
let isLocked = false;

const container = document.getElementById('game-container');
const movesDisplay = document.getElementById('moves-count');
const timerDisplay = document.getElementById('timer');

function startTimer() {
  stopTimer();
  secondsElapsed = 0;
  timerDisplay.textContent = '00:00';
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateMoves() {
  moves++;
  movesDisplay.textContent = moves;
}

function createBoard() {
  container.innerHTML = '';
  selectedCards = [];
  matchedCards = [];
  moves = 0;
  isLocked = false;
  movesDisplay.textContent = '0';

  const pairs = icons.slice(0, 8);
  const cards = [...pairs, ...pairs].sort(() => 0.5 - Math.random());

  cards.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');

    const back = document.createElement('div');
    back.classList.add('card-back');
    const img = document.createElement('img');
    img.src = icon;
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card, icon));
    container.appendChild(card);
  });

  startTimer();
}

function flipCard(card, icon) {
  if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  selectedCards.push({ card, icon });

  if (selectedCards.length === 1) {
    updateMoves();
  }

  if (selectedCards.length === 2) {
    isLocked = true;
    setTimeout(checkMatch, 900);
  }
}

function checkMatch() {
  const [first, second] = selectedCards;
  if (first.icon === second.icon) {
    first.card.classList.add('matched');
    second.card.classList.add('matched');
    matchedCards.push(first, second);
  } else {
    first.card.classList.remove('flipped');
    second.card.classList.remove('flipped');
  }
  selectedCards = [];
  isLocked = false;

  if (matchedCards.length === 16) {
    stopTimer();
    setTimeout(showVictory, 400);
  }
}

function showVictory() {
  document.getElementById('final-moves').textContent = moves;
  document.getElementById('final-time').textContent = timerDisplay.textContent;
  document.getElementById('victory-modal').classList.add('visible');
}

function restartGame() {
  document.getElementById('victory-modal').classList.remove('visible');
  createBoard();
}

document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('play-again-btn').addEventListener('click', restartGame);

createBoard();
