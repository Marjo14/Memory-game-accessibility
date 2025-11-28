// 1. Sélection des éléments importants
const cards = document.querySelectorAll('.card');
const moveCountElement = document.getElementById('move-count');
const resetButton = document.getElementById('reset-button');
const statusElement = document.getElementById('game-status');

// 2. Données du jeu : 8 animaux, chaque animal en double
const animals = ['🐘', '🐼', '🐧', '🦊', '🐢', '🦉', '🦁', '🐋'];
const cardValues = [...animals, ...animals]; // 16 valeurs

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;

// 3. Mélange (shuffle) du tableau
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 4. Initialiser le jeu : mélanger + assigner les animaux aux cartes
function initGame() {
  shuffle(cardValues);

  cards.forEach((card, index) => {
    const value = cardValues[index];
    card.dataset.animal = value; // ex: "🐘"

    // au début : toutes les cartes sont cachées
    card.classList.remove('card--flipped');
    const iconSpan = card.querySelector('.card-icon');
    if (iconSpan) {
      iconSpan.textContent = '🌿'; // face cachée
    }

    // aria-label initial accessible
    card.setAttribute('aria-label', `Carte ${index + 1}, face cachée`);
  });

  // reset de l'état JS
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  moveCountElement.textContent = moves.toString();
  statusElement.textContent = 'Retournez deux cartes pour commencer.';
}

// 5. Gérer le clic sur une carte
function handleCardClick(card) {
  if (lockBoard) return;
  if (card.classList.contains('card--flipped')) return; // déjà retournée

  // retourner visuellement
  flipCard(card);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  moveCountElement.textContent = moves.toString();

  checkForMatch();
}

// 6. Retourner une carte (visuel + accessibilité)
function flipCard(card) {
  card.classList.add('card--flipped');

  const iconSpan = card.querySelector('.card-icon');
  if (iconSpan) {
    // 👉 TODO 1 : ici, remplace l'emoji 🌿 par l'emoji animal (card.dataset.animal)
    iconSpan.textContent = card.dataset.animal; // par ex. "🐘"
  }

  // 👉 TODO 2 : améliorer l'aria-label pour dire quelque chose comme
  // "Carte découverte : éléphant" (pour l'instant on reste simple)
  card.setAttribute('aria-label', 'Carte découverte');
}

// 7. Re-cacher une carte
function hideCard(card, index) {
  card.classList.remove('card--flipped');

  const iconSpan = card.querySelector('.card-icon');
  if (iconSpan) {
    iconSpan.textContent = '🌿';
  }

  card.setAttribute('aria-label', `Carte ${index + 1}, face cachée`);
}

// 8. Vérifier si les deux cartes forment une paire
function checkForMatch() {
  if (!firstCard || !secondCard) return;

  const isMatch = firstCard.dataset.animal === secondCard.dataset.animal;

  if (isMatch) {
    handleMatch();
  } else {
    handleNoMatch();
  }
}

// 9. Si c'est une paire
function handleMatch() {
  matchedPairs++;

  statusElement.textContent = 'Paire trouvée !';

  // on enlève les écouteurs pour ces cartes (elles restent retournées)
  firstCard.removeEventListener('click', onCardClick);
  secondCard.removeEventListener('click', onCardClick);

  // accessibilité : on peut mettre aria-label pour dire "Paire trouvée, carte désactivée"
  firstCard.setAttribute('aria-label', 'Carte faisant partie d’une paire trouvée');
  secondCard.setAttribute('aria-label', 'Carte faisant partie d’une paire trouvée');

  resetTurn();

  if (matchedPairs === animals.length) {
    statusElement.textContent = 'Bravo, vous avez trouvé toutes les paires !';
  }
}

// 10. Si ce n’est pas une paire
function handleNoMatch() {
  statusElement.textContent = 'Pas de correspondance. Essayez encore.';

  lockBoard = true;

  // attendre un peu avant de re-cacher
  setTimeout(() => {
    const firstIndex = Array.from(cards).indexOf(firstCard);
    const secondIndex = Array.from(cards).indexOf(secondCard);

    hideCard(firstCard, firstIndex);
    hideCard(secondCard, secondIndex);

    resetTurn();
  }, 900);
}

// 11. Réinitialiser seulement le tour (pas toute la partie)
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// 12. Gestionnaire de clic utilisé pour add/removeEventListener
function onCardClick(event) {
  handleCardClick(event.currentTarget);
}

// 13. Attacher les écouteurs
cards.forEach((card) => {
  card.addEventListener('click', onCardClick);
});

// 14. Bouton reset
resetButton.addEventListener('click', () => {
  initGame();
});

// 15. Lancer le jeu au chargement
initGame();
