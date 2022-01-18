const diceRollBtn = document.getElementById("dice-btn");
const resetBtn = document.getElementById("reset-btn");
const dice = document.getElementById("dice");
const currentPlayerText = document.getElementById("current-player-id");
const currentPlayerSection = document.getElementById("curent-player-section");
const player1ScoreText = document.getElementById("player-1-score");
const player2ScoreText = document.getElementById("player-2-score");
const player1Section = document.getElementById("player1-section");
const player2Section = document.getElementById("player2-section");

let isGameActive = null;
let randomScore = 0;
let currentPlayer = null;
const players = {
  1: {
    score: 0,
    // isCurrentPlayer: true,
  },
  2: {
    score: 0,
    // isCurrentPlayer: false,
  },
};

gameBegin();

// game begins
function gameBegin() {
  currentPlayer =1;
  currentPlayerText.innerText = currentPlayer;
  player1Section.classList.add("box");
  player1ScoreText.innerText = 0;
  player2ScoreText.innerText = 0;
  diceRollBtn.disabled = false;
  isGameActive = true;
}
/**
 * Attach event listeners to rollBtn and resetBtn
 */
diceRollBtn.addEventListener("click", diceRollHandler);
resetBtn.addEventListener("click", resetBtnHandler);

function diceRollHandler() {
  //change dice image
  setDiceImage();

  //Make diceRollBtn disabled for 1sec and then enable it so  players can't roll dice rapidly
  diceRollBtn.disabled = true;
  setTimeout(() => {
    //enable button back only if game is active otherwise return
    if (!isGameActive) return;
    diceRollBtn.disabled = false;
  }, 1000);

  //add score to the currentPlayer
  addScoreToCurrentPlayer(currentPlayer, randomScore);

  //update scoreText in currentPlayer section
  updateScoreText(currentPlayer);

  //verify and set the game status -- check if anyone wins
  setGameStatus();

  //if after game status set,isGameActive turns to false then make diceBtn disabled and return from here
  if (!isGameActive) {
    // make button disabled
    diceRollBtn.disabled = true;

    //currentPlayer
    currentPlayerSection.classList.add("playerTurnStrike");
    currentPlayerText.innerText = "";
    return;
  }

  //otherwise game is still on, so continue with that

  //change currentPlayer
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  //change the border selection to the currentplayer & remove from old one
  changePlayerSectionBorder();

  //change cxurrentPlayer text in dom
  currentPlayerText.innerText = currentPlayer;
}

function setDiceImage() {
  //generate a random no and assign it to global varibale randomScore
  randomScore = Math.ceil(Math.random() * 6);
  //generate a imagePath
  const imagePath = `assets/images/dice${randomScore}.png`;
  //set image src
  dice.setAttribute("src", imagePath);
}

function addScoreToCurrentPlayer(playerNo, score) {
  players[playerNo].score += score;
}

function updateScoreText(playerNo) {
  const dynamicPlayerSelector =
    currentPlayer === 1 ? player1ScoreText : player2ScoreText;
  //get new score
  const newScore = players[playerNo].score;
  // console.log(newScore);
  dynamicPlayerSelector.innerText = newScore;
}

function changePlayerSectionBorder() {
  if (currentPlayer === 1) {
    player1Section.classList.add("box");
    player2Section.classList.remove("box");
  } else {
    player1Section.classList.remove("box");
    player2Section.classList.add("box");
  }
}

function setGameStatus() {
  if (players[1].score >= 100 || players[2].score >= 100) {
    //means someone wins
    //so append a p tag to that box showing winner

    //create a p element
    const p = document.createElement("p");
    p.classList.add("winner");
    p.innerText = "Winner";

    //append p element to winner player section
    if (players[1].score >= 100) {
      // means player1 wins
      player1Section.appendChild(p);
    } else {
      player2Section.appendChild(p);
    }

    //set isGameActive to false
    isGameActive = false;
  }
}

function resetBtnHandler() {
  //reset all scores
  players[1].score = 0;
  players[2].score = 0;
  // set currentPlayer back to 1
  currentPlayer = 1;

  //remove currentPlayerText
  currentPlayerText.innerText = "";
  currentPlayerSection.classList.remove("playerTurnStrike");

  //remove the winner p element from the  dom if it exists
  const winner = document.querySelector(".winner");
  if (winner) winner.remove();

  //remove the boxes
  player1Section.classList.add("box");
  player2Section.classList.remove("box");

  //initiate the game again
  gameBegin();
}
