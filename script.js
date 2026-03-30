// minesweeper

// generate a grid

const blocks = {
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

function createGrid(width) {
  const presetBlock = document.createElement("button");
  const gridContainer = document.createElement("div");

  presetBlock.classList.add("block");
}
