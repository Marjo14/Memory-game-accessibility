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

// ==================== CONSTANTES / ÉTAT ====================
const COLS = 4; // nombre de colonnes visibles sur la grille (4x4)
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

// ==================== ÉLÉMENTS DOM ====================
const gameGrid = document.getElementById('game-grid');
const moveCountEl = document.getElementById('move-count');
const resetButton = document.getElementById('reset-button');
const statusEl = document.getElementById('game-status');

// Accessibility: region de statut
if (statusEl) {
  statusEl.setAttribute('role', 'status');
  statusEl.setAttribute('aria-live', 'polite');
  statusEl.setAttribute('aria-atomic', 'true');
}

// ==================== UTILITAIRES ====================
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function updateMoveCount() {
  if (moveCountEl) moveCountEl.textContent = moves.toString();
}

function announce(message) {
  if (!statusEl) return;
  statusEl.textContent = '';
  setTimeout(() => { statusEl.textContent = message; }, 50);

  // Visual announcement for hard-of-hearing users (toast)
  showVisualNotice(message);
}

// Ajout : création et affichage d'une annonce visuelle
function showVisualNotice(message, duration = 4000) {
  // ne rien faire si DOM non prêt
  if (!document.body) return;

  let el = document.getElementById('visual-announcement');
  if (!el) {
    el = document.createElement('div');
    el.id = 'visual-announcement';
    el.className = 'visual-announcement';
    el.setAttribute('aria-hidden', 'true'); // c'est visuel, pas répété aux lecteurs
    el.innerHTML = '<span class="va-icon">🔔</span><div class="va-text"></div>';
    document.body.appendChild(el);
  }

  const text = el.querySelector('.va-text');
  text.textContent = message;

  // show
  el.classList.add('visible');

  // reset hide timer
  if (el._hideTimer) clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => {
    el.classList.remove('visible');
    el._hideTimer = null;
  }, duration);
}

function getCardLabel(card, index) {
  if (card.isMatched) return `${card.name}, paire trouvée`;
  if (card.isFlipped) return `${card.name}, carte retournée`;
  return `Carte ${index + 1}, masquée`;
}

function focusCardByIndex(index) {
  if (!gameGrid) return;
  const target = gameGrid.querySelector(`[data-index="${index}"]`);
  if (target) target.focus();
}

// ==================== RENDU ====================
function renderBoard() {
  if (!gameGrid) return;

  // mémoriser focus pour restaurer après rerender
  const active = document.activeElement;
  const prevIndex = active && active.closest && active.closest('#game-grid') ? parseInt(active.dataset.index, 10) : null;

  gameGrid.innerHTML = '';
  gameGrid.setAttribute('role', 'grid');
  gameGrid.setAttribute('aria-label', 'Plateau du jeu — mémoire');
  gameGrid.setAttribute('aria-rowcount', Math.ceil(cards.length / COLS).toString());
  gameGrid.setAttribute('aria-colcount', COLS.toString());

  cards.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card';
    if (card.isFlipped) button.classList.add('card--flipped');
    if (card.isMatched) button.classList.add('card--matched');

    button.setAttribute('role', 'gridcell');
    button.setAttribute('data-id', card.id.toString());
    button.setAttribute('data-index', index.toString());
    button.setAttribute('aria-label', getCardLabel(card, index));
    button.setAttribute('aria-selected', card.isFlipped ? 'true' : 'false');
    button.setAttribute('aria-rowindex', (Math.floor(index / COLS) + 1).toString());
    button.setAttribute('aria-colindex', ((index % COLS) + 1).toString());

    button.tabIndex = card.isMatched ? -1 : 0;
    if (card.isMatched) button.disabled = true;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'card-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = card.isFlipped || card.isMatched ? card.emoji : '🌿';

    button.appendChild(iconSpan);

    button.addEventListener('click', handleCardClick);
    button.addEventListener('keydown', handleCardKeyDown);

    gameGrid.appendChild(button);
  });

  // restaurer focus si possible
  if (prevIndex !== null && !Number.isNaN(prevIndex)) {
    setTimeout(() => focusCardByIndex(prevIndex), 0);
  }
}

// ==================== LOGIQUE DU JEU ====================
function initGame() {
  const pairs = [...animals, ...animals];
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
  announce(`Nouvelle partie commencée. ${cards.length} cartes, ${animals.length} paires à trouver.`);

  // focus sur la première carte interactive
  setTimeout(() => {
    const first = gameGrid.querySelector('.card:not([disabled])');
    if (first) first.focus();
  }, 100);
}

function handleCardClick(event) {
  if (!canFlip) return;
  const button = event.currentTarget;
  const index = parseInt(button.dataset.index, 10);
  if (Number.isNaN(index)) return;

  const card = cards[index];
  if (!card || card.isFlipped || card.isMatched) return;

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
  if (!card1 || !card2) {
    flippedCards = [];
    canFlip = true;
    return;
  }

  // retrouver les indices actuels des cartes dans l'array
  const idx1 = cards.findIndex(c => c === card1);
  const idx2 = cards.findIndex(c => c === card2);

  if (card1.name === card2.name) {
    card1.isMatched = true;
    card2.isMatched = true;
    matchedPairs++;
    announce(`Paire trouvée : ${card1.name}. ${animals.length - matchedPairs} paires restantes.`);
    if (matchedPairs === animals.length) {
      setTimeout(handleVictory, 500);
    }

    // après appariement, chercher une carte interactive voisine pour placer le focus
    const findNextInteractive = (start) => {
      // forward search
      for (let i = start + 1; i < cards.length; i++) {
        if (!cards[i].isMatched) return i;
      }
      // backward search
      for (let i = start - 1; i >= 0; i--) {
        if (!cards[i].isMatched) return i;
      }
      return null;
    };

    // choisir une position proche à partir de la plus petite des deux indices
    const base = Math.min(idx1, idx2);
    const nextIndex = findNextInteractive(base);
    flippedCards = [];
    canFlip = true;
    renderBoard();

    if (nextIndex !== null) {
      // attendre que DOM soit mis à jour avant focus
      setTimeout(() => focusCardByIndex(nextIndex), 0);
    } else {
      // sinon, focus sur le bouton recommencer s'il existe
      const rb = document.getElementById('reset-button');
      if (rb) setTimeout(() => rb.focus(), 0);
    }

  } else {
    // pas de correspondance : retourner les cartes
    card1.isFlipped = false;
    card2.isFlipped = false;
    announce('Pas de correspondance. Essayez encore.');

    // restaurer le focus sur la première carte cliquée (si elle existe)
    flippedCards = [];
    canFlip = true;
    renderBoard();
    if (idx1 !== -1) setTimeout(() => focusCardByIndex(idx1), 0);
  }
}

function handleVictory() {
  const message = `Bravo ! Vous avez gagné en ${moves} coups !`;
  announce(message + ' Appuyez sur Recommencer pour rejouer.');
}

// ==================== NAVIGATION CLAVIER (FLÈCHES) ====================
function handleCardKeyDown(event) {
  const key = event.key;
  const current = event.currentTarget;
  const idx = parseInt(current.dataset.index, 10);
  if (Number.isNaN(idx)) return;

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
    event.preventDefault();
    let target = idx;
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    const rows = Math.ceil(cards.length / COLS);

    if (key === 'ArrowLeft') {
      target = col > 0 ? idx - 1 : idx;
    } else if (key === 'ArrowRight') {
      target = (col < COLS - 1 && idx + 1 < cards.length) ? idx + 1 : idx;
    } else if (key === 'ArrowUp') {
      target = row > 0 ? idx - COLS : idx;
    } else if (key === 'ArrowDown') {
      target = row < rows - 1 && idx + COLS < cards.length ? idx + COLS : idx;
    } else if (key === 'Home') {
      target = row * COLS;
    } else if (key === 'End') {
      target = Math.min((row + 1) * COLS - 1, cards.length - 1);
    }

    if (target !== idx) focusCardByIndex(target);
    return;
  }

  // Enter/Space déclenchent automatiquement le click sur <button>
}

// ==================== RESET ====================
if (resetButton) {
  resetButton.addEventListener('click', () => {
    initGame();
  });
}

// ==================== DÉMARRAGE ====================
initGame();
