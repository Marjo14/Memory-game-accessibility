# Memory Game — Biodiversité 🌿

Jeu de mémoire accessible dédié aux animaux en danger, conçu avec l'accessibilité comme priorité.

## 🎮 Fonctionnalités

- **Jeu de mémoire classique** : Trouvez toutes les paires d'animaux en danger (8 paires, 16 cartes).
- **Navigation complète au clavier** :
  - **Tab** : naviguer entre les cartes
  - **Flèches** (↑ ↓ ← →) : déplacer le focus dans la grille 4×4
  - **Entrée** ou **Espace** : retourner une carte
  - **Home/End** : aller au début/fin d'une ligne
- **Lecteur d'écran** : Annonces ARIA pour chaque action (carte retournée, paire trouvée, victoire).
- **Notification visuelle** : Toast en bas à droite pour les malentendants.
- **Thème accessible** : Contraste élevé, focus visible, animation réduite respectée.

## 📋 Accessibilité

### WCAG 2.1 (AA)
- ✅ Navigation clavier complète
- ✅ ARIA labels et live regions
- ✅ Contraste de couleur suffisant (4.5:1)
- ✅ Focus visible et persistant
- ✅ Support prefers-reduced-motion

### Utilisateurs cibles
- **Malvoyants** : lecteur d'écran (NVDA, VoiceOver, JAWS)
- **Malentendants** : notifications visuelles (toast)
- **Motricité réduite** : navigation clavier complète, pas de gestes complexes
- **Daltoniens** : couleurs testées (contraste texte/fond)

## 🚀 Installation

1. Cloner ou télécharger le dossier.
2. Ouvrir `index.html` dans un navigateur moderne.
3. Pas de serveur nécessaire.

## 📁 Structure

```
Memory-game-accessibility/
├── index.html          # Structure HTML sémantique
├── style.css           # Styles accessibles + animations
├── script.js           # Logique du jeu + gestion clavier/ARIA
└── README.md           # Ce fichier
```

## 🎯 Comment jouer

1. **Cliquez** (ou **Entrée**) sur une carte pour la retourner.
2. Retournez une deuxième carte.
3. Si les deux cartes correspondent → elles restent retournées (paire trouvée).
4. Sinon → elles se retournent automatiquement.
5. **Objectif** : Trouvez les 8 paires en minimum de coups.
6. **Recommencer** : Cliquez sur le bouton "Recommencer".

### Commandes clavier
| Action | Touche |
|--------|--------|
| Naviguer | Tab ou Flèches |
| Retourner une carte | Entrée ou Espace |
| Début/Fin de ligne | Home / End |

## 🧪 Tests d'accessibilité

### Lecteur d'écran (Mac/Windows)
- **VoiceOver** (macOS) : Cmd + F5 pour activer
- **NVDA** (Windows) : Gratuit, https://www.nvaccess.org/

### Outils
- [axe DevTools](https://www.deque.com/axe/devtools/) — vérifier les violations WCAG
- [WAVE](https://wave.webaim.org/) — rapport d'accessibilité
- Chrome DevTools → Lighthouse → Accessibilité

### Points clés à tester
- Navigation Tab dans la grille
- Flèches (haut/bas/gauche/droite) + Home/End
- Annonces aria-live à la retournement d'une carte
- Notification toast à droite (ne gêne pas la lecture)
- Contraste visuel et focus-visible

## 🐾 Animaux du jeu

Tous les animaux sont en danger selon l'UICN (liste rouge) :
- 🐼 Panda géant
- 🦁 Lion
- 🐘 Éléphant
- 🦒 Girafe
- 🐯 Tigre
- 🦏 Rhinocéros
- 🐋 Baleine
- 🦜 Perroquet

## 💻 Compatibilité

| Navigateur | Support |
|------------|---------|
| Chrome/Edge (v90+) | ✅ Complet |
| Firefox (v88+) | ✅ Complet |
| Safari (v14+) | ✅ Complet |
| Internet Explorer | ❌ Non supporté |

## 🔧 Maintenance / Améliorations futures

- [ ] Difficulté progressive (grilles 3×3, 5×5, etc.)
- [ ] Score/temps
- [ ] Modes sombres (dark mode) accessibles
- [ ] Support tactile amélioré
- [ ] Localisation (EN, ES, DE, etc.)

## 📚 Ressources WCAG

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/) — articles et outils

## 👨‍💻 Auteur

Marjolaine — Projet M3 Accessibilité (ADA)

## 📄 Licence

Libre d'utilisation à des fins éducatives.

---

**Questions ou feedback ?** Testez avec un lecteur d'écran et signalez les problèmes. 🎉