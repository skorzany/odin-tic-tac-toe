function cell(symbol="") {
    let marker = symbol;

    const getMarker = () => marker;
    const setMarker = (m) => marker = m;
    const isEmpty = () => !marker;

    return {
        getMarker,
        setMarker,
        isEmpty,
    }
}

function gameBoard() {
    const ROWNUM = 3;
    const COLNUM = 3;
    const board = [];

    for(r = 0; r < ROWNUM; r++) {
        const row = [];
        for(c = 0; c < COLNUM; c++) {
            row.push(cell());
        }
        board.push(row);
    }

    const placeMarker = function (cell, marker) {
        if (cell.isEmpty()){
            cell.setMarker(marker);
        }
    }

    const getBoard = () => board;

    const findTriple = function (symbol) {
        let triples = [];
        const matchingSymbol = (obj) => obj.getMarker() === symbol;
        // rows
        for(row of board) {
            if(row.every(matchingSymbol)) triples.push(row);
        }
        // columns
        for(let r = 0; r < ROWNUM; r++) {
            const column = [];
            for(let c = 0; c < COLNUM; c++) {
                column.push(board[c][r]);
            }
            if(column.every(matchingSymbol)) triples.push(column);
        }
        // diagonals
        const diagonals = [[], []];
        for(let i = 0; i < ROWNUM; i++) {
            diagonals[0].push(board[i][i]);
            diagonals[1].push(board[i][-i + 2]);
        }
        for(diagonal of diagonals){
            if(diagonal.every(matchingSymbol)) triples.push(diagonal);
        }

        return triples;
    }

    //below are helper functions only for console version, they will be removed later

    const printBoard = () => {
        const output = board.map((row => (row.map((cell) => cell.getMarker()))));
        console.log(output);
    }

    const getCell = (x, y) => board[x][y];

    return {
        placeMarker,
        getBoard,
        findTriple,
        printBoard,
        getCell,
    }
}

function player(name, marker) {
    const myName = name;
    const myMarker = marker;

    const getName = () => myName;
    const getMarker = () => myMarker;

    return {
        getName,
        getMarker,
    }
}

function ticTacToe() {
    const players = [player("John", "X"), player("Jenny", "O")];
    const buttons = [...document.body.querySelectorAll("button")];
    let roundNumber;
    let board;
    let viewer;
    let gameEnded;
    let currentPlayer;
    let tilesToHighlight;

    buttons[0].addEventListener("click", () => {viewer.showForm();});

    buttons[1].addEventListener("click", (e) => {
        e.preventDefault();
        viewer.hideForm();
    });

    const endGame = () => gameEnded = true;
    const advanceRound = () => roundNumber++;
    const getCurrentPlayer = () => players[roundNumber%2];
    const showInfo = () => {
        console.log(`It's ${currentPlayer.getMarker()} (${currentPlayer.getName()}'s) turn.`)
    }
    const grabInput = () => {
        let emptyCell = false;
        while(!emptyCell) {
            var row = prompt("Row number?");
            var column = prompt("Column number?");
            emptyCell = board.getCell(row, column).isEmpty();
            if(!emptyCell) alert("This cell is already claimed!");
        }
        return [row, column];
    }
    const viewSummary = (winningCells, player) => {
        let msg = "Game ended. "
        if(winningCells.length) {
            msg += `${player.getMarker()} (${player.getName()}) wins!`;
        }
        else {
            msg += "It's a tie!";
        }
        console.log(msg);
        board.printBoard();
        console.log(winningCells);
    }
    const playRound = () => {
        // change current player;
        currentPlayer = getCurrentPlayer();
        // grab current player's symbol;
        const symbol = currentPlayer.getMarker();
        // show info & the board;
        showInfo();
        board.printBoard();
        // gather input (it should ask forever until it is valid);
        const coords = grabInput();
        // place marker on given cell;
        board.placeMarker(board.getCell(...coords), symbol);
        // check for win condition but only when there were at least 4 rounds played;
        if(4 <= roundNumber) {
            const winningCells = board.findTriple(symbol);
            if(winningCells.length || roundNumber === 8) {
                endGame();
                return winningCells;
            }
        }
        advanceRound();
    }
    const setDefaultState = () => {
        roundNumber = 0;
        board = gameBoard();
        viewer = viewController();
        viewer.updateBoard();
        gameEnded = false;
        tilesToHighlight = [];
    }
    const newGame = () => {
        setDefaultState();
        while(!gameEnded) {
            roundOutput = playRound();
            if(roundOutput !== undefined) tilesToHighlight.push(...roundOutput);
        }
        viewSummary(tilesToHighlight, currentPlayer);
    }
    const viewController = () => {
        const formContainer = document.body.querySelector(".header-bot");
        const boardContainer = document.body.querySelector(".board");
        const infoText = document.body.querySelector(".info-box p");

        for(row of board.getBoard()) {
            for(obj of row) {
                const newCell = document.createElement("div");
                newCell.classList.add("cell", "empty");
                newCell.object = obj;
                boardContainer.appendChild(newCell);
            }
        }
        const showForm = () => {
            formContainer.classList.remove("hidden");
        }
        const hideForm = () => {
            formContainer.classList.add("hidden");
        }
        const updateBoard = () => {
            for(ele of boardContainer.children) {
                ele.textContent = ele.object.getMarker();
                if(!ele.object.isEmpty()) ele.classList.remove("empty");
            }
        }
        const updateInfo = (txt) => {
            infoText.textContent = txt;
        }

        return {
            showForm,
            hideForm,
            updateBoard,
            updateInfo,
        }
    }

    return {
        newGame,
    }
}


// WHOLE GAME
const game = ticTacToe();
game.newGame();