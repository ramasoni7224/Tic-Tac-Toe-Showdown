const levelSelect = document.getElementById("levelSelect");
const gameBoard = document.getElementById("gameBoard");
const boxes = document.querySelectorAll(".box");
const turnDisplay = document.getElementById("turnDisplay");
const userScoreSpan = document.getElementById("userScore");
const aiScoreSpan = document.getElementById("aiScore");
const msgContainer = document.getElementById("msgContainer");
const msg = document.getElementById("msg");

let userScore = 0;
let aiScore = 0;
let isUserTurn = true;
let difficulty = "easy";
let gameOver = false;
let lastLoser = null; // 'X' or 'O'


const winningPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Load theme
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

// Start game with selected difficulty
function startGame(level) {
  difficulty = level;
  levelSelect.classList.add("hide");
  gameBoard.classList.remove("hide");
  startNewGame();
}

// Update turn display
function updateTurn() {
  if (gameOver) return;
  turnDisplay.innerText = isUserTurn ? "🎮 Your Turn (X)" : "🤖 AI's Turn (O)";
  if (!isUserTurn) {
    setTimeout(aiMove, 400);
  }
}

// User move
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (isUserTurn && box.innerText === "" && !gameOver) {
      box.innerText = "X";
      box.disabled = true;
      isUserTurn = false;
      checkWinner();
      updateTurn();
    }
  });
});

// AI move logic based on difficulty
function aiMove() {
  if (gameOver) return;

  let emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");

  if (difficulty === "medium") {
    for (let pattern of winningPattern) {
      let [a, b, c] = pattern;
      let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
      if (
        values.filter(val => val === "X").length === 2 &&
        values.includes("")
      ) {
        let emptyIndex = pattern[values.indexOf("")];
        boxes[emptyIndex].innerText = "O";
        boxes[emptyIndex].disabled = true;
        isUserTurn = true;
        checkWinner();
        updateTurn();
        return;
      }
    }
  }

  if (difficulty === "hard") {
    let bestMove = getBestMove();
    if (bestMove !== -1) {
      boxes[bestMove].innerText = "O";
      boxes[bestMove].disabled = true;
    }
  } else {
    // Easy & fallback for Medium
    if (emptyBoxes.length > 0) {
      let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
      randomBox.innerText = "O";
      randomBox.disabled = true;
    }
  }

  isUserTurn = true;
  checkWinner();
  updateTurn();
}

// Best move for Hard Mode using Minimax
function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = "O";
      let score = minimax(boxes, 0, false);
      box.innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  let winner = getWinner(board);
  if (winner === "X") return -10 + depth;
  if (winner === "O") return 10 - depth;
  if (isTie(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((box, i) => {
      if (box.innerText === "") {
        box.innerText = "O";
        let score = minimax(board, depth + 1, false);
        box.innerText = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((box, i) => {
      if (box.innerText === "") {
        box.innerText = "X";
        let score = minimax(board, depth + 1, true);
        box.innerText = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// Get winner for minimax
function getWinner(board) {
  for (let pattern of winningPattern) {
    const [a, b, c] = pattern;
    if (
      board[a].innerText &&
      board[a].innerText === board[b].innerText &&
      board[a].innerText === board[c].innerText
    ) {
      return board[a].innerText;
    }
  }
  return null;
}

// Check if tie
function isTie(board) {
  return [...board].every(box => box.innerText !== "") && !getWinner(board);
}

// Check and declare game winner
function checkWinner() {
  for (let pattern of winningPattern) {
    let [a, b, c] = pattern;
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

// Show win/tie message and update scores
function declareWinner(winner) {
  gameOver = true;

  if (winner === "tie") {
    msg.innerText = "😲 It's a Tie!";
    lastLoser = lastLoser === "X" ? "O" : "X"; // Alternate turn on tie
  } else if (winner === "X") {
    msg.innerText = "🏆 You Win!";
    userScore++;
    userScoreSpan.innerText = userScore;
    lastLoser = "O";
  } else {
    msg.innerText = "💀 AI Wins!";
    aiScore++;
    aiScoreSpan.innerText = aiScore;
    lastLoser = "X";
  }

  msgContainer.classList.remove("hide");
  boxes.forEach(box => box.disabled = true);
}


// Start a new game
function startNewGame() {
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
  });

  msgContainer.classList.add("hide");
  gameOver = false;

  // Assign first turn to the loser of last round
  if (lastLoser === "X") {
    isUserTurn = true;
  } else if (lastLoser === "O") {
    isUserTurn = false;
  } else {
    isUserTurn = true; // default for first match
  }

  updateTurn();
}

