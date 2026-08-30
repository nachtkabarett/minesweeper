// entry point
/*

  todo 
  1. enforce proper styling for the grid based on the rows and columns
  2. introduce the actual game logic


*/

const VALID_DIFFICULTIES = ["ez", "mid", "mein leben"] as const;

interface GameState {
  boardCreated: boolean;
  selDiff: (typeof VALID_DIFFICULTIES)[number] | undefined;
}

const gameState: GameState = {
  boardCreated: false,
  selDiff: undefined,
};

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

document.addEventListener("DOMContentLoaded", () => {
  const gameDiv = document.createElement("div");
  const boardDiv = document.createElement("div");
  const controlsDiv = document.createElement("div");
  const boardBtn = document.createElement("button");

  boardBtn.textContent = "create board";

  document.body.append(gameDiv);
  gameDiv.append(boardDiv, controlsDiv);
  controlsDiv.append(boardBtn);

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
    if (gameState.selDiff !== undefined) {
      if (gameState.boardCreated) {
        console.warn("Watchdog: A board is already active.");
        return;
      }

      const currentConfig = difficulties[gameState.selDiff];

      const boardSize =
        difficulties[gameState.selDiff].rows *
        difficulties[gameState.selDiff].cols;

      for (let i = 0; i < boardSize; i++) {
        const cell = document.createElement("button");
        boardDiv.append(cell);
      }

      gameState.boardCreated = true;
    } else {
      window.alert("a difficulty isn't selected!");
      throw new Error(" a difficulty isn't selected!");
    }
  });
});
