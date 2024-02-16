let containerId = "connect-four";
const playerPiece = "red-piece";
const computerPiece = "yellow-piece";

let lastMoveRow;
let lastMoveColumn;

function loadConnectFour(containerId) {
    let container = document.getElementById(containerId);
    let board = document.createElement("div");
    board.className = "connect-four-board";
    container.appendChild(board);
    loadBoard(board); 
}

function loadBoard(board) {
    // Create the empty game board HTML structure
    for (let i = 0; i < 6; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.className = "connect-four-row";
        for (let j = 0; j < 7; j++) {
            let cellDiv = document.createElement("div");
            cellDiv.className = `connect-four-cell row-${i} column-${j}`;
            cellDiv.dataset.row = i; 
            cellDiv.dataset.column = j;
           // cellDiv.innerHTML=`${i}, ${j}`
            rowDiv.appendChild(cellDiv);
        }
        board.appendChild(rowDiv);
    }

    // Add click event listener to each cell
    let cells = document.querySelectorAll('.connect-four-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', playerMove);
    });
}

// Function to handle player's move
function playerMove(event) {
    let row = event.target.dataset.row; 
    dropPiece(row, playerPiece);

    // Set the coordinates of the most recently placed red piece
    lastRedPieceRow = parseInt(row);
    lastRedPieceColumn = parseInt(event.target.dataset.column);
    
    // After player's move, trigger computer's move
    setTimeout(computerMove, 500); // Delay computer move for better visualization
}

// Function to drop a piece in the specified column
function dropPiece(row, pieceClass) {
    let targetCells = document.querySelectorAll(`.connect-four-cell[data-row="${row}"]`);
    let targetCell;
    for (let i = targetCells.length - 1; i >= 0; i--) {
        if (!targetCells[i].hasChildNodes()) {
            targetCell = targetCells[i];
            break;
        }
    }
    if (targetCell) {
        let piece = document.createElement("div");
        piece.className = "connect-four-piece " + pieceClass;
        targetCell.appendChild(piece);
    } else {
        alert("Column is full! Please choose another Column.");
    }
}

function computerMove() {
    // Get all cells with red pieces
    const redCells = document.querySelectorAll('.connect-four-cell .' + playerPiece);

    // If there are no red cells, return
    if (redCells.length === 0) {
        return;
    }

    let validMoveMade = false;

    // Keep trying until a valid move is made
    while (!validMoveMade) {
        // Randomly choose a red cell
        const randomRedCell = redCells[Math.floor(Math.random() * redCells.length)];

        // Get the row and column of the randomly chosen red cell
        const row = parseInt(randomRedCell.parentElement.dataset.row);
        const col = parseInt(randomRedCell.parentElement.dataset.column);

        // Find an adjacent empty cell and place a yellow piece
        validMoveMade = placeAdjacentComputerPiece(row, col);
    }
}



// check if the cell contains a player's piece
function isPlayerPiece(row, column) {
    let cell = document.querySelector(`.connect-four-cell[data-row="${row}"][data-column="${column}"]`);
    if (cell && cell.firstChild && cell.firstChild.classList.contains(playerPiece)) {
        return true;
    }
    return false;
}

function placeAdjacentComputerPiece(row, column) {
    // Check adjacent cells (horizontally, vertically, and diagonally)
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // Skip the current cell and out-of-bounds cells
            if (i === 0 && j === 0 || row + i < 0 || row + i >= 6 || column + j < 0 || column + j >= 7) {
                continue;
            }
            let newRow = row + i;
            let newColumn = column + j;
            console.log("Checking cell:", newRow, newColumn);
            if (isEmptyCell(newRow, newColumn)) {
                console.log("Empty cell found:", newRow, newColumn);
                // Place the computer's piece in the empty adjacent cell
                dropPiece(newRow, computerPiece);
                return true; // Exit the function after placing the piece
            }
        }
    }
    return false; // No valid move can be made
}


// check if the cell coordinates are valid
function isValidCell(row, column) {
    return row >= 0 && row < 6 && column >= 0 && column < 7;
}

// check if the cell is empty
function isEmptyCell(row, column) {
    let cell = document.querySelector(`.connect-four-cell[data-row="${row}"][data-column="${column}"]`);
    return cell && !cell.firstChild;
}

// Call the loadConnectFour function when the page loads
window.onload = function() {
    loadConnectFour(containerId);
};
