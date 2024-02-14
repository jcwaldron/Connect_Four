let containerId = "connect-four";

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
            cellDiv.innerText="x";
            rowDiv.appendChild(cellDiv);
        }
        board.appendChild(rowDiv);
    }
}

// Call the loadConnectFour function when the page loads
window.onload = function() {
    loadConnectFour(containerId);
};
