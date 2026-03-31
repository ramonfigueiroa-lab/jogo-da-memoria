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

const container    = document.getElementById('game-container');
const movesDisplay = document.getElementById('moves-count');
const timerDisplay = document.getElementById('timer');

// ── Timer ──────────────────────────────────────────────

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
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateMoves() {
  moves++;
  movesDisplay.textContent = moves;
}

// ── Board ──────────────────────────────────────────────

function createBoard() {
  container.innerHTML = '';
  selectedCards = [];
  matchedCards  = [];
  moves         = 0;
  isLocked      = false;
  movesDisplay.textContent = '0';

  const pairs = icons.slice(0, 8);
  const cards = [...pairs, ...pairs].sort(() => 0.5 - Math.random());

  cards.forEach(icon => {
    const card  = document.createElement('div');
    card.classList.add('card');

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');

    const back  = document.createElement('div');
    back.classList.add('card-back');
    const img   = document.createElement('img');
    img.src     = icon;
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
  if (selectedCards.length === 1) updateMoves();
  if (selectedCards.length === 2) { isLocked = true; setTimeout(checkMatch, 900); }
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
  if (matchedCards.length === 16) { stopTimer(); setTimeout(showVictory, 400); }
}

// ── Ranking ────────────────────────────────────────────

function loadRanking() {
  return JSON.parse(localStorage.getItem('jogo-memoria-ranking') || '[]');
}

function saveToRanking(name) {
  const ranking = loadRanking();
  ranking.push({ name, seconds: secondsElapsed, moves, date: new Date().toLocaleDateString('pt-BR') });
  ranking.sort((a, b) => a.seconds - b.seconds || a.moves - b.moves);
  const top5 = ranking.slice(0, 5);
  localStorage.setItem('jogo-memoria-ranking', JSON.stringify(top5));
  return top5;
}

function formatTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function renderRanking(ranking) {
  const medals = ['🥇', '🥈', '🥉', '4º', '5º'];
  const list   = document.getElementById('ranking-list');

  if (ranking.length === 0) {
    list.innerHTML = '<p class="ranking-empty">Nenhum registro ainda.<br>Seja o primeiro! 🎯</p>';
    return;
  }

  const justSaved = ranking.findIndex(e => e.seconds === secondsElapsed && e.moves === moves);

  list.innerHTML = ranking.map((entry, i) => `
    <div class="ranking-item ${i === 0 ? 'gold' : ''} ${i === justSaved ? 'new-entry' : ''}">
      <span class="rank-pos">${medals[i]}</span>
      <span class="rank-name">${entry.name}</span>
      <span class="rank-time">${formatTime(entry.seconds)}</span>
      <span class="rank-moves">${entry.moves} jog.</span>
    </div>
  `).join('');
}

// ── Modal ──────────────────────────────────────────────

function showVictory() {
  document.getElementById('final-moves').textContent = moves;
  document.getElementById('final-time').textContent  = timerDisplay.textContent;
  document.getElementById('player-name').value       = '';
  document.getElementById('name-section').style.display    = 'block';
  document.getElementById('ranking-section').style.display = 'none';
  document.getElementById('victory-modal').classList.add('visible');
  setTimeout(() => document.getElementById('player-name').focus(), 150);
}

function submitScore() {
  const name  = document.getElementById('player-name').value.trim() || 'Anônimo';
  const top5  = saveToRanking(name);
  renderRanking(top5);
  document.getElementById('name-section').style.display    = 'none';
  document.getElementById('ranking-section').style.display = 'block';
}

function openRanking() {
  const ranking = loadRanking();
  renderRanking(ranking);
  document.getElementById('name-section').style.display    = 'none';
  document.getElementById('ranking-section').style.display = 'block';
  document.getElementById('victory-modal').classList.add('visible');
}

function restartGame() {
  document.getElementById('victory-modal').classList.remove('visible');
  createBoard();
}

// ── Events ─────────────────────────────────────────────

document.getElementById('player-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitScore();
});
document.getElementById('save-score-btn').addEventListener('click', submitScore);
document.getElementById('skip-btn').addEventListener('click', restartGame);
document.getElementById('play-again-btn').addEventListener('click', restartGame);
document.getElementById('close-ranking-btn').addEventListener('click', () => {
  document.getElementById('victory-modal').classList.remove('visible');
});
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('ranking-btn').addEventListener('click', openRanking);

createBoard();
