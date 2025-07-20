let boxes = document.querySelectorAll(".box");
let turnO = true;
let resetbtn = document.querySelector(".reset");
let newgamebtn = document.querySelector(".newgame-btn");
let msgbox = document.querySelector(".msg-container");
let sms = document.getElementById("msg");
let currentSpan = document.getElementById("current");

const winningpattern = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

const updateTurn = () => {
  currentSpan.innerText = turnO ? "O" : "X";
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    box.innerText = turnO ? "O" : "X";
    box.disabled = true;
    turnO = !turnO;
    updateTurn();
    checkwinner();
  });
});

const disabledbtn = () => {
  boxes.forEach((box) => box.disabled = true);
};

const enablebtn = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
  turnO = true;
  updateTurn();
};

const showWinner = (winner) => {
  sms.innerText = `🎉 Congratulations! ${winner} Wins! 🎉`;
  msgbox.classList.remove("hide");
  disabledbtn();
};

const showTie = () => {
  sms.innerText = "😲 It's a Tie!";
  msgbox.classList.remove("hide");
  disabledbtn();
};

const checkwinner = () => {
  let winnerFound = false;

  for (let pattern of winningpattern) {
    let [a, b, c] = pattern;
    if (
      boxes[a].innerText !== "" &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      showWinner(boxes[a].innerText);
      winnerFound = true;
      return;
    }
  }

  let allFilled = Array.from(boxes).every((box) => box.innerText !== "");
  if (!winnerFound && allFilled) {
    showTie();
  }
};

const resetgame = () => {
  msgbox.classList.add("hide");
  enablebtn();
};

resetbtn.addEventListener("click", resetgame);
newgamebtn.addEventListener("click", resetgame);

updateTurn();
