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
            cellDiv.dataset.row = j; 
            cellDiv.dataset.column = i;
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
async function playerMove(event) {
    let column = event.target.dataset.column; 

    dropPiece(column, playerPiece);

    // Set the last move column coordinate
    lastMoveColumn = parseInt(column);

    // Wait for a brief delay before checking for win and showing alert
    await new Promise(resolve => setTimeout(resolve, 200));

    if (await checkForWin(lastMoveRow, lastMoveColumn, playerPiece)) {
        if (confirm("Player wins! Play again?")){
            location.reload();
        }
    } else {
        computerMove();
    }
}

// Function to drop a piece to bottom of column
function dropPiece(column, pieceClass) {

    // Select all cells in the specified column
    let targetCells = document.querySelectorAll(`.connect-four-cell[data-column="${column}"]`);
    let targetCell;

    // Iterate through the cells in reverse order (from bottom to top)
    for (let i = targetCells.length - 1; i >= 0; i--) {
        if (!targetCells[i].hasChildNodes()) {
            targetCell = targetCells[i];
            break;
        }
    }

    // If there is an empty cell available in the column
    if (targetCell) {
        // Create a new piece element of player or computer class
        let piece = document.createElement("div");
        piece.className = "connect-four-piece " + pieceClass;

        // Append the piece to the target cell
        targetCell.appendChild(piece);

        // Update the coordinates of the last moved piece
        lastMoveColumn = column;
        lastMoveRow = parseInt(targetCell.getAttribute('data-row'));

    } else {
        alert("Column is full! Please choose another column.");
    }
}

async function computerMove() {
    // Get all cells with red pieces
    const redCells = document.querySelectorAll('.connect-four-cell .' + playerPiece);

    // If no red cells (player has not moved), don't make a move
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

    // delay for piece placement before checking win
    await new Promise(resolve => setTimeout(resolve, 100));

    if (await checkForWin(lastMoveRow, lastMoveColumn, computerPiece)) {
        if(confirm("Computer wins! Play again?")){
            location.reload();
        }
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

// put a computer piece in a cell adjacent to any random player piece
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
            if (isEmptyCell(newRow, newColumn)) {
                lastMoveColumn = newColumn;
                lastMoveRow = newRow;
                // Place the computer's piece in the empty adjacent cell
                dropPiece(newColumn, computerPiece);
                return true; // Exit the function after placing the piece
            }
        }
    }
    return false; // No valid move can be made
}


// check if the cell coordinates are valid
function isValidCell(row, column) {
    return row >= 0 && row <= 6 && column >= 0 && column <= 7;
}

// check if the cell is empty
function isEmptyCell(row, column) {
    let cell = document.querySelector(`.connect-four-cell[data-row="${row}"][data-column="${column}"]`);
    return cell && !cell.firstChild;
}

// checking for wins
function checkForWin(row, column, pieceClass) {
    // Check horizontally
    if (
        checkDirection(row, column, 0, 1, pieceClass) +
        checkDirection(row, column, 0, -1, pieceClass) >= 3
    ) {
        return true;
    }
    // Check vertically
    if (
        checkDirection(row, column, 1, 0, pieceClass) +
        checkDirection(row, column, -1, 0, pieceClass) >= 3
    ) {
        return true;
    }
    // Check diagonally (bottom-left to top-right)
    if (
        checkDirection(row, column, 1, 1, pieceClass) +
        checkDirection(row, column, -1, -1, pieceClass) >= 3
    ) {
        return true;
    }
    // Check diagonally (top-left to bottom-right)
    if (
        checkDirection(row, column, 1, -1, pieceClass) +
        checkDirection(row, column, -1, 1, pieceClass) >= 3
    ) {
        return true;
    }
    return false;
}


function checkDirection(row, column, rowIncrement, columnIncrement, pieceClass) {
    let count = 0;
    let newRow = row;
    let newColumn = column;

    // Count the consecutive pieces in the specified direction
    while (isValidCell(newRow, newColumn) && count < 4) {
        newRow += rowIncrement;
        newColumn += columnIncrement;

        let cell = document.querySelector(`.connect-four-cell[data-row="${newRow}"][data-column="${newColumn}"]`);

        if (!cell || !cell.firstChild || !cell.firstChild.classList.contains(pieceClass)) {
            break; // Stop if the cell is empty or contains a different color piece
        }  
        
        count++;
    }

    return count;
}


// Call the loadConnectFour function when the page loads
window.onload = function() {
    loadConnectFour(containerId);
};
