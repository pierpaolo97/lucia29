import './style.css';

const app = document.querySelector('#app');

const items = {
  C: { emoji: '🎂', name: 'Candelina', msg: '+1 anno di caos' },
  P: { emoji: '🥞', name: 'Pancake', msg: 'Unico nutrimento consentito' },
  T: { emoji: '🧑🏻‍🌾', name: 'Trattore', msg: 'Hai trovato Antonio versione contadina del weekend!' },
  D: { emoji: '🦷', name: 'Dentino', msg: 'Paziente salvato, forse' },
  S: { emoji: '🍹', name: 'Spritz', msg: 'Pronta per il Pink Spritz al The Botanist' },
};

let maze = [
  '#############',
  '#L....#....G#',
  '#.##.#.#.##.#',
  '#....#.#...C#',
  '####.#.###.##',
  '#....#.....##',
  '#.######.#..#',
  '#......#.#P.#',
  '##.###.#.####',
  '#..#...#....#',
  '#.##.#####..#',
  '#....T......#',
  '####.###.####',
  '#....#...D..#',
  '#.##.#.###.##',
  '#..#.....#..#',
  '##.#####.#.##',
  '#....S......#',
  '#.#########.#',
  '#...........#',
  '#############',
].map(row => row.split(''));

let player = { x: 1, y: 1 };
let collected = 0;
const totalItems = Object.keys(items).length;

let message = 'Raccogli tutti gli oggetti e raggiungi il regalo 🎁';
let showToast = false;
let toastTimer = null;
let gameStarted = false;

function render() {
  if (!gameStarted) {
    app.innerHTML = `
      <main class="intro">
        <h1>Basic bitch 29</h1>

        <div class="intro-card">
          <h2>🎮 Regole del gioco</h2>

          <p>Raccogli tutti e 5 i tuoi oggetti:</p>
          <p class="objects">🎂 🥞 🧑🏻‍🌾 🦷 🍹</p>

          <p>Solo dopo potrai sbloccare il regalo 🎁</p>

          <p>
            Usa le frecce per muoverti.
            Cerca di non (s)battere contro i muri, anche se sappiamo che sarà difficile.
          </p>

          <button class="start-button" onclick="startGame()">
            In bocca al lupo
          </button>
        </div>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main>
      <h1>Basic bitch 29</h1>

      <p class="subtitle">Raccogli i 5 oggetti e sblocca il regalo.</p>

      <div class="status">
        <span>Oggetti: ${collected}/${totalItems}</span>
      </div>

      <div class="toast-container">
        ${showToast ? `<div class="toast">${message}</div>` : ''}
      </div>

      <div class="maze ${showToast && message.includes('sbattono') ? 'shake' : ''}">        ${maze.map((row, y) =>
          row.map((cell, x) => {
            let content = '';

            if (player.x === x && player.y === y) content = '💃🏻';
            else if (cell === '#') content = '';
            else if (cell === 'G') content = '🎁';
            else if (items[cell]) content = items[cell].emoji;

            return `<div class="cell ${cell === '#' ? 'wall' : 'path'}">${content}</div>`;
          }).join('')
        ).join('')}
      </div>

      <div class="controls">
        <button ontouchstart="move(0,-1)">⬆️</button>
        <div>
          <button ontouchstart="move(-1,0)">⬅️</button>
          <button ontouchstart="move(0,1)">⬇️</button>
          <button ontouchstart="move(1,0)">➡️</button>
        </div>
      </div>
    </main>
  `;
}

window.startGame = function() {
  gameStarted = true;
  render();
};

window.move = function(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (
    ny < 0 ||
    ny >= maze.length ||
    nx < 0 ||
    nx >= maze[ny].length ||
    maze[ny][nx] === '#'
  ) {
    vibrate([60, 40, 60]);
    triggerToast('Ahi. Anche le dottoresse (s)battono.', 1200);
    return;
  }

  const next = maze[ny][nx];
  player = { x: nx, y: ny };

  if (items[next]) {
    collected++;
    maze[ny][nx] = '.';
    vibrate(120);
    triggerToast(items[next].msg, 2200);
    return;
  }

  if (next === 'G') {
    if (collected === totalItems) {
      vibrate([120, 60, 120, 60, 240]);
      showFinalScreen();
      return;
    }

    triggerToast('Prima devi raccogliere tutti gli oggetti.', 1600);
    return;
  }

  render();
};

function showFinalScreen() {
  app.innerHTML = `
    <main class="final">
      <h1>🎉 AUGURI LUCII 🎉</h1>

      <p>
        Incredibile davvero: dopo 29 anni sei riuscita ad arrivare fin qui
        con il tuo telefono, completamente da sola.
      </p>

      <p>
        Senza chiedere aiuto a nessuno, hai raccolto tutti gli oggetti
        e hai sbloccato il regalo. Siamo tutti molto fieri di te.
      </p>

      <div class="gift">CODICE-GIFT-CARD-QUI</div>

      <p class="subtitle">
        Ora goditi il regalo, basica!
      </p>
    </main>
  `;
}

function triggerToast(text, duration = 2200) {
  message = text;
  showToast = true;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    showToast = false;
    toastTimer = null;
    render();
  }, duration);

  render();
}

function vibrate(pattern = 100) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

window.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  if (e.key === 'ArrowUp') move(0, -1);
  if (e.key === 'ArrowDown') move(0, 1);
  if (e.key === 'ArrowLeft') move(-1, 0);
  if (e.key === 'ArrowRight') move(1, 0);
});


render();