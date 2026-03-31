// minesweeper

// define cells

const cells = {
  undiscovered: "⬜️",
  discovered: "🔳",
  oneBomb: "1️⃣",
  twoBomb: "2️⃣",
  threeBomb: "3️⃣",
  fourBomb: "4️⃣",
  fiveBomb: "5️⃣",
  sixBomb: "6️⃣",
  sevenBomb: "7️⃣",
  eightBomb: "8️⃣",
  bomb: "💣",
  userSuprised: "😮",
  userDefault: "🙂",
  userDead: "💀",
  userSunglasses: "😎",
  flag: "🚩",
};

// define states of a cell

const cell = {
  isBomb: false,
  isFlagged: false,
  isNumber: false,
  neighborCount: 0,
  isUnrevealed: true,
};

// game itself

function minesweeperGame() {
  const width = Number(window.prompt("enter the width of the grid"));
  const allCells = [];

  function createGrid(width) {
    const container = document.querySelector(".grid-container");
    container.style.gridTemplateColumns = `repeat(${width}, 30px)`;

    const totalCells = width * width;

    for (let i = 0; i < totalCells; i++) {
      const presetCell = document.createElement("button");
      presetCell.classList.add("block");
      presetCell.cellParams = { ...cell };
      allCells.push(presetCell);
      container.append(presetCell);

      if (presetCell.cellParams.isUnrevealed === true) {
        presetCell.textContent = cells.undiscovered;
      }
    }
  }

  createGrid(width);
}

document.addEventListener("DOMContentLoaded", minesweeperGame);
