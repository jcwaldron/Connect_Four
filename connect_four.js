let containerId = "connect-four";
const playerPiece = "red-piece";
const computerPiece = "yellow-piece";

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
            cellDiv.className = "connect-four-cell";
            //cellDiv.innerText="x";
            cellDiv.dataset.row = i; // Changed dataset name to "row"
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

function computerMove() {
    let randomRow = getRandomNumber(); // Get a random row for computer's move
    dropPiece(randomRow, computerPiece);
}

// Function to handle player's move
function playerMove(event) {
    let row = event.target.dataset.row; // Get row index from dataset attribute
    dropPiece(row, playerPiece);
    // After player's move, trigger computer's move
    setTimeout(computerMove, 500); // Delay computer move for better visualization
}

// Generate a random number between 0 and 6 for computer move
function getRandomNumber(){
    return Math.floor(Math.random() * 6);
}

// Function to drop a piece in the specified row
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
        alert("Row is full! Please choose another row.");
    }
}

// Call the loadConnectFour function when the page loads
window.onload = function() {
    loadConnectFour(containerId);
};
