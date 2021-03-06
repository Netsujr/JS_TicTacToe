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
    console.log(markedCells());
    console.log(computerMove());
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
  computerMove();
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


// computer logic

// create a function to check for available cells
function markedCells() {
  let cells = [];
  for (let i = 0; i < cellsElements.length; i++) {
    if (cellsElements[i].classList.contains(X_CLASS) || cellsElements[i].classList.contains(CIRCLE_CLASS)) {
      cells.push(i);
    }
  }
  return cells;
}

// create a function to check for computer best move

function bestMove() {
  let cells = markedCells();
  let bestCell = cells[0];
  let bestScore = -Infinity;
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    let cellScore = minimax(cell, false, 0);
    if (cellScore > bestScore) {
      bestScore = cellScore;
      bestCell = cell;
    }
  }
  return bestCell;
}

// define minmax function
function minimax(current_board, current_player) {
  let availableCells = markedCells(current_board);
  if (checkWin(CIRCLE_CLASS)) {
    return 1;
  } else if (checkWin(X_CLASS)) {
    return -1;
  } else if (availableCells.length === 0) {
    return 0;
  }
  let moves = [];
  for (let i = 0; i < availableCells.length; i++) {
    let move = {};
    move.index = current_board[availableCells[i]];
    current_board[availableCells[i]] = current_player ? 1 : -1;
    if (current_player) {
      move.score = minimax(current_board, false);
    } else {
      move.score = minimax(current_board, true);
    }
    current_board[availableCells[i]] = move.index;
    moves.push(move);
  }
}



// create a function to place computer move

function computerMove() {
  let cell = bestMove();
  placeMark(cellsElements[cell], CIRCLE_CLASS);
  if (checkWin(CIRCLE_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}
