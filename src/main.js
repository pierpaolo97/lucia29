import './style.css';

const app = document.querySelector('#app');

const items = {
  C: { emoji: '🕯️', name: 'Candelina', msg: '+1 anno di caos' },
  P: { emoji: '🥞', name: 'Pancake', msg: 'Brunch energy detected' },
  T: { emoji: '🚜', name: 'Trattore', msg: 'Campagnolità aumentata' },
  D: { emoji: '🦷', name: 'Dentino', msg: 'Paziente salvato, forse' },
  S: { emoji: '🍹', name: 'Spritz', msg: 'Social battery restored' },
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

function render() {
  app.innerHTML = `
    <main>
      <h1>Lucia 29 Quest</h1>
      <p class="subtitle">Raccogli i 5 oggetti sacri e sblocca la gift card.</p>

      <div class="status">
        <span>Oggetti: ${collected}/${totalItems}</span>
      </div>

      <div class="maze">
        ${maze.map((row, y) =>
          row.map((cell, x) => {
            let content = '';

            if (player.x === x && player.y === y) content = '👩‍⚕️';
            else if (cell === '#') content = '';
            else if (cell === 'G') content = '🎁';
            else if (items[cell]) content = items[cell].emoji;

            return `<div class="cell ${cell === '#' ? 'wall' : 'path'}">${content}</div>`;
          }).join('')
        ).join('')}
      </div>

      <p class="message">${message}</p>

      <div class="controls">
        <button onclick="move(0,-1)">⬆️</button>
        <div>
          <button onclick="move(-1,0)">⬅️</button>
          <button onclick="move(0,1)">⬇️</button>
          <button onclick="move(1,0)">➡️</button>
        </div>
      </div>
    </main>
  `;
}

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
    message = 'Ahi. Muro.';
    render();
    return;
  }

  const next = maze[ny][nx];
  player = { x: nx, y: ny };

  if (items[next]) {
    collected++;
    message = items[next].msg;
    maze[ny][nx] = '.';
  }

  if (next === 'G') {
    if (collected === totalItems) {
      app.innerHTML = `
        <main class="final">
          <h1>🎉 Gift Card Sbloccata 🎉</h1>
          <p>Complimenti Lucia, hai superato il test dei 29 anni.</p>
          <div class="gift">CODICE-GIFT-CARD-QUI</div>
          <p class="subtitle">Usala con responsabilità. O almeno provaci.</p>
        </main>
      `;
      return;
    }

    message = 'Prima devi raccogliere tutti gli oggetti sacri.';
  }

  render();
};
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') move(0, -1);
  if (e.key === 'ArrowDown') move(0, 1);
  if (e.key === 'ArrowLeft') move(-1, 0);
  if (e.key === 'ArrowRight') move(1, 0);
});

render();
