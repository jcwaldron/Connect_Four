let containerId = "connect-four";
const playerPiece = "red-piece";
const computerPiece = "yellow-piece";

let lastMoveRow;
let lastMoveColumn;

function loadConnectFour(containerId) {
    try {
        let container = document.getElementById(containerId);
        if (!container) {
            throw new Error("Container element not found.");
        }
        let board = document.createElement("div");
        board.className = "connect-four-board";
        container.appendChild(board);
        loadBoard(board);
    } catch (error) {
        console.error(`Error in loadConnectFour: ${error.message}`);
    }
}

function loadBoard(board) {
    try {
        if (!board) {
            throw new Error("Board element is null or undefined.");
        }
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
    } catch (error) {
        console.error(`Error in loadBoard: ${error.message}`);
    }
}

// Function to handle player's move
async function playerMove(event) {
    try {
        let column = event.target.dataset.column;
        if (!column) {
            throw new Error("Column data attribute not found.");
        }
        dropPiece(column, playerPiece);

        // Set the last move column coordinate
        lastMoveColumn = parseInt(column);

        // Wait for a brief delay before checking for win and showing alert
        await new Promise(resolve => setTimeout(resolve, 200));

        if (await checkForWin(lastMoveRow, lastMoveColumn, playerPiece)) {
            if (confirm("Player wins! Play again?")) {
                location.reload();
            }
        } else {
            computerMove();
        }
    } catch (error) {
        console.error(`Error in playerMove: ${error.message}`);
    }
}

// Function to drop a piece to the bottom of a column
function dropPiece(column, pieceClass) {
    try {
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
    } catch (error) {
        console.error(`Error in dropPiece: ${error.message}`);
    }
}

// Function to handle the computer's move
async function computerMove() {
    try {
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
            if (confirm("Computer wins! Play again?")) {
                location.reload();
            }
        }
    } catch (error) {
        console.error(`Error in computerMove: ${error.message}`);
    }
}

// Function to check if a cell contains a player's piece
function isPlayerPiece(row, column) {
    let cell = document.querySelector(`.connect-four-cell[data-row="${row}"][data-column="${column}"]`);
    if (cell && cell.firstChild && cell.firstChild.classList.contains(playerPiece)) {
        return true;
    }
    return false;
}

// Function to place a computer piece in a cell adjacent to any random player piece
function placeAdjacentComputerPiece(row, column) {
    try {
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
    } catch (error) {
        console.error(`Error in placeAdjacentComputerPiece: ${error.message}`);
        return false;
    }
}

// Function to check if the cell coordinates are valid
function isValidCell(row, column) {
    return row >= 0 && row <= 6 && column >= 0 && column <= 7;
}

// Function to check if a cell is empty
function isEmptyCell(row, column) {
    let cell = document.querySelector(`.connect-four-cell[data-row="${row}"][data-column="${column}"]`);
    return cell && !cell.firstChild;
}

// Function to check for wins
function checkForWin(row, column, pieceClass) {
    try {
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
    } catch (error) {
        console.error(`Error in checkForWin: ${error.message}`);
        return false;
    }
}

// Function to check the direction for consecutive pieces
function checkDirection(row, column, rowIncrement, columnIncrement, pieceClass) {
    try {
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
    } catch (error) {
        console.error(`Error in checkDirection: ${error.message}`);
        return 0;
    }
}

// Call the loadConnectFour function when the page loads
window.onload = function() {
    loadConnectFour(containerId);
};
