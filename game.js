(function () {
  'use strict';

  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  // Returns 'X' or 'O' if one owns a full line in `cells`, else null.
  function lineWinner(cells) {
    for (const [a, b, c] of LINES) {
      if (cells[a] && cells[a] !== 'draw' && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }

  let state;

  function newGame() {
    state = {
      cells: Array.from({ length: 9 }, () => Array(9).fill(null)), // cells[board][cell]
      boardResults: Array(9).fill(null), // null | 'X' | 'O' | 'draw'
      player: 'X',
      nextBoard: null, // index of the board the player must play in, or null for any open board
      winner: null, // null | 'X' | 'O' | 'draw'
    };
    render();
  }

  function isBoardOpen(b) {
    return state.boardResults[b] === null;
  }

  function isPlayable(b) {
    if (state.winner || !isBoardOpen(b)) return false;
    return state.nextBoard === null || state.nextBoard === b;
  }

  function play(b, c) {
    if (!isPlayable(b) || state.cells[b][c]) return;

    state.cells[b][c] = state.player;

    // Resolve the small board.
    const small = lineWinner(state.cells[b]);
    if (small) state.boardResults[b] = small;
    else if (state.cells[b].every(Boolean)) state.boardResults[b] = 'draw';

    // Resolve the big board.
    const big = lineWinner(state.boardResults);
    if (big) state.winner = big;
    else if (state.boardResults.every((r) => r !== null)) state.winner = 'draw';

    // The opponent is sent to the big cell matching the small cell just played.
    // If that board is already won or full, they may play in any open board.
    state.nextBoard = isBoardOpen(c) ? c : null;
    state.player = state.player === 'X' ? 'O' : 'X';
    render();
  }

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');

  function markSpan(p) {
    return `<span class="mark-${p.toLowerCase()}">${p}</span>`;
  }

  function render() {
    if (state.winner === 'draw') {
      statusEl.innerHTML = "It's a draw.";
    } else if (state.winner) {
      statusEl.innerHTML = `${markSpan(state.winner)} wins!`;
    } else {
      const where = state.nextBoard === null ? 'any open board' : 'the highlighted board';
      statusEl.innerHTML = `${markSpan(state.player)} to play in ${where}`;
    }

    boardEl.innerHTML = '';
    boardEl.classList.toggle('free-choice', !state.winner && state.nextBoard === null);
    for (let b = 0; b < 9; b++) {
      const small = document.createElement('div');
      const playable = isPlayable(b);
      small.className = 'small-board ' + (playable ? 'active' : 'inactive');

      for (let c = 0; c < 9; c++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cell';
        const v = state.cells[b][c];
        if (v) {
          btn.textContent = v;
          btn.classList.add('mark-' + v.toLowerCase());
        }
        btn.disabled = !playable || Boolean(v);
        btn.setAttribute('aria-label', `Board ${b + 1}, cell ${c + 1}${v ? ', ' + v : ''}`);
        btn.addEventListener('click', () => play(b, c));
        small.appendChild(btn);
      }

      const result = state.boardResults[b];
      if (result) {
        const overlay = document.createElement('div');
        overlay.className = 'winner-overlay ' + (result === 'draw' ? 'draw' : 'mark-' + result.toLowerCase());
        overlay.textContent = result === 'draw' ? 'Draw' : result;
        small.appendChild(overlay);
      }

      boardEl.appendChild(small);
    }
  }

  document.getElementById('reset').addEventListener('click', newGame);
  newGame();
})();
