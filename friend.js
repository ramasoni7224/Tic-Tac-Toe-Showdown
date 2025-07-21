const nameForm = document.getElementById("nameForm");
const gameBoard = document.getElementById("gameBoard");
const startGameBtn = document.getElementById("startGame");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");

const turnDisplay = document.getElementById("turnDisplay");
const p1NameDisplay = document.getElementById("p1Name");
const p2NameDisplay = document.getElementById("p2Name");
const p1ScoreDisplay = document.getElementById("p1Score");
const p2ScoreDisplay = document.getElementById("p2Score");

const msgContainer = document.getElementById("msgContainer");
const msg = document.getElementById("msg");
const newGameBtns = document.querySelectorAll(".newgame-btn");
const boxes = document.querySelectorAll(".box");

let player1 = "", player2 = "";
let turnO = false; // false = X (P1), true = O (P2)
let p1Score = 0, p2Score = 0;
let lastLoser = null;
let gameOver = false;

const winningPattern = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

startGameBtn.addEventListener("click", () => {
  player1 = player1Input.value.trim() || "Player 1";
  player2 = player2Input.value.trim() || "Player 2";

  p1NameDisplay.innerText = player1;
  p2NameDisplay.innerText = player2;

  updateTurnDisplay();

  nameForm.classList.add("hide");
  gameBoard.classList.remove("hide");
});

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameOver || box.innerText !== "") return;

    box.innerText = turnO ? "O" : "X";
    box.disabled = true;

    checkWinner();

    if (!gameOver) {
      turnO = !turnO;
      updateTurnDisplay();
    }
  });
});

function updateTurnDisplay() {
  const name = turnO ? player2 : player1;
  turnDisplay.innerText = `🎮 Current Turn: ${name}`;
}

function checkWinner() {
  for (let pattern of winningPattern) {
    const [a, b, c] = pattern;
    if (
      boxes[a].innerText !== "" &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      declareWinner(boxes[a].innerText);
      return;
    }
  }

  const allFilled = [...boxes].every(box => box.innerText !== "");
  if (allFilled) {
    declareWinner("tie");
  }
}

function declareWinner(winnerSymbol) {
  gameOver = true;

  if (winnerSymbol === "tie") {
    msg.innerText = "😲 It's a Tie!";
    lastLoser = lastLoser === "X" ? "O" : "X";
  } else if (winnerSymbol === "X") {
    msg.innerText = `🏆 ${player1} Wins!`;
    p1Score++;
    p1ScoreDisplay.innerText = p1Score;
    lastLoser = "O";
  } else {
    msg.innerText = `🏆 ${player2} Wins!`;
    p2Score++;
    p2ScoreDisplay.innerText = p2Score;
    lastLoser = "X";
  }

  msgContainer.classList.remove("hide");
  boxes.forEach(box => box.disabled = true);
}

function startNewGame() {
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
  });

  msgContainer.classList.add("hide");
  gameOver = false;

  // Set turn based on lastLoser
  if (lastLoser === "X") {
    turnO = false; // X (player1) gets first turn
  } else if (lastLoser === "O") {
    turnO = true;  // O (player2) gets first turn
  } else {
    turnO = false; // default first game
  }

  updateTurnDisplay();
}

// New Game buttons
newGameBtns.forEach((btn) => {
  btn.addEventListener("click", startNewGame);
});

// Theme support
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
}
