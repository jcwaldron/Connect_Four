let containerId = "connect-four";

function loadConnectFour(containerId) {
    let container = document.getElementById(containerId);
    let board = document.createElement("div");
    board.className = "connect-four-board";
    board.textContent = "test";


    container.appendChild(board);
    return board;
    
}