// entry point

/*
  todo (single index.ts file)
  1. model the board as data: a Cell[][] grid where every cell has
     { isMine, revealed, flagged, adjMines } - the DOM buttons just mirror this
  2. place bombs: shuffle every cell index [0..rows*cols), take the first N = bombs,
     set isMine = true on those
  3. count adjacent mines: for each non-mine cell, count mines in the 8 neighbors
     (dx,dy in [-1,0,1], skip 0,0 and out-of-bounds) -> adjMines
  4. wire clicks: left-click -> reveal(r, c), right-click (contextmenu, preventDefault) -> toggleFlag(r, c)
  5. reveal logic: flagged/revealed cells do nothing; mine => game over, reveal all mines;
     number => reveal it; 0 => flood-fill reveal neighbors
  6. win check: if revealedCells === rows*cols - bombs, you won
  7. render: sync data grid -> DOM using cellTypes classes/values
*/

const VALID_DIFFICULTIES = ["ez", "mid", "mein leben"] as const;

interface GameState {
  boardCreated: boolean;
  boardDiff: (typeof VALID_DIFFICULTIES)[number] | undefined;
  selDiff: (typeof VALID_DIFFICULTIES)[number] | undefined;
  minesPlaced: boolean;
  revealedCells: number;
}

interface Cell {
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjMines: number;
}

const gameState: GameState = {
  boardCreated: false,
  boardDiff: undefined,
  selDiff: undefined,
  minesPlaced: false,
  revealedCells: 0,
};

let playerBoard: Cell[][] = [];
let cellButtons: HTMLButtonElement[][] = [];
let currentConfig: { rows: number; cols: number; bombs: number } | undefined;
let gameOver = false;

const cellTypes = {
  revealedCell: {
    type: "empty",
    isMine: false,
    className: "cell-revealed",
  },
  hiddenCell: {
    type: "flag",
    isMine: false,
    className: "hidden-cell",
  },
  flaggedCell: {
    type: "flag",
    isMine: false,
    val: "🚩",
    className: "cell-flagged",
  },
  numberCell: {
    type: "number",
    isMine: false,
    className: "cell-number",
  },
  bombCell: {
    type: "bomb",
    isMine: true,
    val: "💣",
    className: "cell-bomb",
  },
};

const difficulties: Record<
  Exclude<GameState["selDiff"], undefined>,
  { rows: number; cols: number; bombs: number }
> = {
  ez: { rows: 9, cols: 9, bombs: 10 },
  mid: { rows: 16, cols: 16, bombs: 40 },
  "mein leben": { rows: 24, cols: 30, bombs: 180 },
};

const neighborDirs = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const getNeighbors = (r: number, c: number) => {
  const neighbors: [number, number][] = [];
  for (const [dr, dc] of neighborDirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < currentConfig!.rows && nc >= 0 && nc < currentConfig!.cols) {
      neighbors.push([nr, nc]);
    }
  }
  return neighbors;
};

const shuffle = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const placeMines = (safeRow: number, safeCol: number) => {
  const { rows, cols, bombs } = currentConfig!;
  const totalCells = rows * cols;
  const indices = shuffle(Array.from({ length: totalCells }, (_, i) => i));

  const safeSet = new Set<number>();
  safeSet.add(safeRow * cols + safeCol);
  for (const [dr, dc] of neighborDirs) {
    const nr = safeRow + dr;
    const nc = safeCol + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      safeSet.add(nr * cols + nc);
    }
  }

  let placed = 0;
  for (const idx of indices) {
    if (placed >= bombs) break;
    if (safeSet.has(idx)) continue;
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    playerBoard[r][c].isMine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (playerBoard[r][c].isMine) continue;
      let count = 0;
      for (const [nr, nc] of getNeighbors(r, c)) {
        if (playerBoard[nr][nc].isMine) count++;
      }
      playerBoard[r][c].adjMines = count;
    }
  }

  gameState.minesPlaced = true;
};

const renderCell = (r: number, c: number) => {
  const cell = playerBoard[r][c];
  const btn = cellButtons[r][c];

  btn.className = "";
  btn.textContent = "";

  if (cell.flagged) {
    btn.className = cellTypes.flaggedCell.className;
    btn.textContent = cellTypes.flaggedCell.val;
    return;
  }

  if (!cell.revealed) {
    btn.className = cellTypes.hiddenCell.className;
    return;
  }

  if (cell.isMine) {
    btn.className = cellTypes.bombCell.className;
    btn.textContent = cellTypes.bombCell.val;
    return;
  }

  if (cell.adjMines > 0) {
    btn.className = cellTypes.numberCell.className;
    btn.textContent = String(cell.adjMines);
    btn.style.color = ["blue", "green", "red", "purple", "maroon", "teal", "black", "gray"][cell.adjMines - 1]!;
    return;
  }

  btn.className = cellTypes.revealedCell.className;
};

const checkWin = () => {
  const totalSafe = currentConfig!.rows * currentConfig!.cols - currentConfig!.bombs;
  if (gameState.revealedCells === totalSafe) {
    gameOver = true;
    window.alert("you won!!1!");
  }
};

const revealAllMines = () => {
  const { rows, cols } = currentConfig!;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (playerBoard[r][c].isMine) {
        playerBoard[r][c].revealed = true;
        playerBoard[r][c].flagged = false;
        renderCell(r, c);
      }
    }
  }
};

const reveal = (r: number, c: number) => {
  const cell = playerBoard[r][c];
  if (cell.revealed || cell.flagged || gameOver) return;

  if (cell.isMine) {
    cell.revealed = true;
    gameOver = true;
    renderCell(r, c);
    revealAllMines();
    window.alert("game over!!1!");
    return;
  }

  const queue: [number, number][] = [[r, c]];
  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    const cur = playerBoard[cr][cc];
    if (cur.revealed || cur.flagged || cur.isMine) continue;

    cur.revealed = true;
    gameState.revealedCells++;
    renderCell(cr, cc);

    if (cur.adjMines === 0) {
      for (const [nr, nc] of getNeighbors(cr, cc)) {
        if (!playerBoard[nr][nc].revealed) {
          queue.push([nr, nc]);
        }
      }
    }
  }

  checkWin();
};

const toggleFlag = (r: number, c: number) => {
  const cell = playerBoard[r][c];
  if (cell.revealed || gameOver) return;
  cell.flagged = !cell.flagged;
  renderCell(r, c);
};

document.addEventListener("DOMContentLoaded", () => {
  const gameDiv = document.createElement("div");
  const boardDiv = document.createElement("div");
  const controlsDiv = document.createElement("div");
  const boardBtn = document.createElement("button");

  boardBtn.textContent = "create board";

  document.body.append(gameDiv);
  gameDiv.append(boardDiv, controlsDiv);
  controlsDiv.append(boardBtn);

  const generateBoard = (
    cfg: (typeof difficulties)[Exclude<GameState["selDiff"], undefined>]
  ) => {
    currentConfig = cfg;
    boardDiv.replaceChildren();

    playerBoard = Array.from({ length: cfg.rows }, () =>
      Array.from({ length: cfg.cols }, () => ({
        isMine: false,
        revealed: false,
        flagged: false,
        adjMines: 0,
      })),
    );

    cellButtons = Array.from({ length: cfg.rows }, () => []);

    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cellTypes.hiddenCell.className;
        btn.style.width = "24px";
        btn.style.height = "24px";
        btn.style.padding = "0";
        btn.style.borderRight = "1px solid #000";
        btn.style.borderBottom = "1px solid #000";
        btn.style.fontSize = "12px";
        btn.style.lineHeight = "24px";
        btn.style.textAlign = "center";

        btn.addEventListener("click", () => {
          if (!gameState.minesPlaced) {
            placeMines(r, c);
          }
          reveal(r, c);
        });

        btn.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          if (!gameState.minesPlaced) return;
          toggleFlag(r, c);
        });

        boardDiv.append(btn);
        cellButtons[r][c] = btn;
      }
    }

    boardDiv.style.display = "grid";
    boardDiv.style.gridTemplateColumns = `repeat(${cfg.cols}, 24px)`;
    boardDiv.style.gridTemplateRows = `repeat(${cfg.rows}, 24px)`;
    boardDiv.style.gap = "0";
    boardDiv.style.border = "1px solid #000";

    gameState.boardCreated = true;
    gameState.boardDiff = gameState.selDiff;
    gameState.minesPlaced = false;
    gameState.revealedCells = 0;
    gameOver = false;
  };

  for (const diff in difficulties) {
    const diffBtn = document.createElement("button");
    diffBtn.textContent = diff;
    controlsDiv.append(diffBtn);

    diffBtn.addEventListener("click", () => {
      gameState.selDiff = diff as GameState["selDiff"];
      console.log(gameState.selDiff);
    });
  }

  boardBtn.addEventListener("click", () => {
    if (gameState.selDiff === undefined) {
      window.alert("a difficulty isn't selected!");
      throw new Error(" a difficulty isn't selected!");
    }

    if (gameState.boardCreated && gameState.selDiff === gameState.boardDiff) {
      window.alert("a board already exists at this difficulty!");
      return;
    }

    const cfg = difficulties[gameState.selDiff];
    generateBoard(cfg);
  });
});
