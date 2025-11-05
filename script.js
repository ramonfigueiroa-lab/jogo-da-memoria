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
const container = document.getElementById('game-container');

function createBoard() {
  const pairs = icons.slice(0, 8);
  const cards = [...pairs, ...pairs].sort(() => 0.5 - Math.random());

  cards.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');
    const img = document.createElement('img');
    img.src = icon;
    card.appendChild(img);
    card.addEventListener('click', () => flipCard(card, icon));
    container.appendChild(card);
  });
}

function flipCard(card, icon) {
  if (selectedCards.length === 2 || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  selectedCards.push({ card, icon });

  if (selectedCards.length === 2) {
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [first, second] = selectedCards;
  if (first.icon === second.icon) {
    matchedCards.push(first, second);
  } else {
    first.card.classList.remove('flipped');
    second.card.classList.remove('flipped');
  }
  selectedCards = [];

  if (matchedCards.length === 16) {
    setTimeout(() => alert("Parabéns! Você completou o jogo!"), 500);
  }
}

createBoard();
