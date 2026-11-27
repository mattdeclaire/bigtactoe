# Big Tac Toe

Tic tac toe, nested. The big board has a small tic tac toe board in each of its nine cells. Two players share one device.

## Rules

- Players take turns placing X or O in a cell of any small board they're allowed to play in. X goes first.
- Where you play decides where your opponent plays next: if you play in, say, the top-right cell of a small board, your opponent must play in the top-right small board of the big board.
- Winning a small board claims that cell of the big board for you.
- Three big cells in a row wins the game.
- If you're sent to a small board that's already won or full, you may play in any open board.

## Running it

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server
```

## Hosting

The site is served by GitHub Pages from the root of `main` (Settings → Pages → Deploy from a branch → `main` / `/ (root)`). `.nojekyll` tells Pages to serve the files as-is.
