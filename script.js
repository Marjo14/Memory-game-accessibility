// ==================== DONNÉES ====================
const animals = [
  { emoji: '🐼', name: 'Panda géant' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐘', name: 'Éléphant' },
  { emoji: '🦒', name: 'Girafe' },
  { emoji: '🐯', name: 'Tigre' },
  { emoji: '🦏', name: 'Rhinocéros' },
  { emoji: '🐋', name: 'Baleine' },
  { emoji: '🦜', name: 'Perroquet' }
];

// État du jeu
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

// Éléments DOM
const gameGrid = document.getElementById('game-grid');
const moveCountEl = document.getElementById('move-count');
const resetButton = document.getElementById('reset-button');
const statusEl = document.getElementById('game-status');

// ==================== FONCTION MÉLANGE ====================
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==================== INIT JEU ====================
function initGame() {
  const pairs = [...animals, ...animals]; // 2 fois chaque animal
  const shuffledPairs = shuffle(pairs);

  cards = shuffledPairs.map((animal, index) => ({
    id: index,
    emoji: animal.emoji,
    name: animal.name,
    isFlipped: false,
    isMatched: false
  }));

  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  canFlip = true;
  updateMoveCount();
  renderBoard();
  announce('Nouvelle partie commencée. 16 cartes, 8 paires à trouver.');
}

// ==================== RENDU DU PLATEAU ====================
function getCardLabel(card) {
  if (card.isMatched) {
    return `${card.name}, paire trouvée`;
  }
  if (card.isFlipped) {
    return `${card.name}, carte retournée`;
  }
  return `Carte ${card.id + 1}, masquée`;
}

function renderBoard() {
  gameGrid.innerHTML = '';

  cards.forEach((card) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card';
    if (card.isFlipped) button.classList.add('card--flipped');
    if (card.isMatched) {
      button.classList.add('card--matched');
      button.disabled = true;
    }

    button.setAttribute('role', 'gridcell');
    button.setAttribute('data-id', card.id.toString());
    button.setAttribute('aria-label', getCardLabel(card));

    const iconSpan = document.createElement('span');
    iconSpan.className = 'card-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = card.isFlipped || card.isMatched ? card.emoji : '🌿';

    button.appendChild(iconSpan);
    button.addEventListener('click', handleCardClick);

    gameGrid.appendChild(button);
  });
}

// ==================== LOGIQUE DU JEU ====================
function updateMoveCount() {
  moveCountEl.textContent = moves.toString();
}

function announce(message) {
  statusEl.textContent = message;
}

function handleCardClick(event) {
  if (!canFlip) return;

  const button = event.currentTarget;
  const cardId = parseInt(button.dataset.id, 10);
  const card = cards[cardId];

  if (card.isFlipped || card.isMatched) return;

  card.isFlipped = true;
  flippedCards.push(card);
  renderBoard();
  announce(`${card.name} retournée`);

  if (flippedCards.length === 2) {
    moves++;
    updateMoveCount();
    canFlip = false;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.name === card2.name) {
    card1.isMatched = true;
    card2.isMatched = true;
    matchedPairs++;
    announce(`Paire trouvée ! ${card1.name}. ${8 - matchedPairs} paires restantes.`);
    if (matchedPairs === 8) {
      setTimeout(handleVictory, 500);
    }
  } else {
    card1.isFlipped = false;
    card2.isFlipped = false;
    announce('Pas de correspondance. Essayez encore.');
  }

  flippedCards = [];
  canFlip = true;
  renderBoard();
}

function handleVictory() {
  const message = `Bravo ! Vous avez gagné en ${moves} coups !`;
  announce(message + ' Appuyez sur Recommencer pour rejouer.');
}

// ==================== RESET ====================
resetButton.addEventListener('click', () => {
  initGame();
  setTimeout(() => {
    const firstCardButton = gameGrid.querySelector('.card');
    if (firstCardButton) firstCardButton.focus();
  }, 100);
});

// DÉMARRAGE
initGame();
