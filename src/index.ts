// entry point
/*

  todo:
  1. make sure it's impossible to creating boards infinitely
  2. make sure i can split whatever into i can into other files and make shit less global
  3. make a state management system for difficulty
  4. make a "watchdog" for the create button, that if the difficulty isn't selected, it will never create a board
  5. make sure once a board is craeted, the only way to re-create it is when the user refreshes the board through a diffrent tool or changes the difficulty 
  


*/

const gameState = {

  
}

document.addEventListener("DOMContentLoaded", () => {
  const gameDiv = document.createElement("div");
  const boardDiv = document.createElement("div");
  const controlsDiv = document.createElement("div");

  const boardBtn = document.createElement("button");
  const diffDiv = document.createElement("div");

  document.body.append(gameDiv);

  gameDiv.append(controlsDiv, boardDiv);
  controlsDiv.append(diffDiv, boardBtn);

  boardBtn.textContent = "create board";

  const diffArr: string[] = ["ez", "mid", "mein leben"];

  boardBtn.addEventListener("click", () => {


  })

  for (const diff of diffArr) {
    const diffBtn = document.createElement("button");
    diffBtn.textContent = diff;
    diffDiv.append(diffBtn);

    diffBtn.addEventListener("click", () => {
      const selectedDiff = diff;
    });
  }
});
