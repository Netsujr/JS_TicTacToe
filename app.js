const cellsElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
let circleTurn = true;
const winningMessageTextElement = document.querySelector('[data-winning-message]');
const winningMessageElement = document.getElementById('winning-message');
const restartButton = document.getElementById('restartButton');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

startGame();

cellsElements.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    // console.log('winner');
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    // swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? 'Renato Wins' : 'You Win'}!`;
  }
  winningMessageElement.classList.add('show');
}


function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function isDraw() {
  return [...cellsElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function startGame() {
  circleTurn = false;
  cellsElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellsElements[index].classList.contains(currentClass);
    });
  });
}

restartButton.addEventListener('click', () => {
  winningMessageElement.classList.remove('show');

  startGame();
});


// AI logic

// create a function to check for available cells


// create a function to check for AI best move


// create a function to place AI move
