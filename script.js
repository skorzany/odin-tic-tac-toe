function cell(symbol="") {
    let content = symbol;

    const getContent = () => content;
    const setContent = (c) => content = c;
    const isEmpty = () => !content;

    return {
        getContent,
        setContent,
        isEmpty,
    }
}

function gameBoard(rows, columns) {
    const rowNum = rows;
    const colNum = columns;
    const board = [];

    for(r = 0; r < rowNum; r++) {
        const row = [];
        for(c = 0; c < colNum; c++) {
            row.push(cell());
        }
        board.push(row);
    }

    const placeMarker = function (cell, player) {
        if (cell.isEmpty()){
            cell.setContent(player.getMarker());
        }
    }

    const getBoard = () => board;

    const winningState = function (symbol) {
        const matchingSymbol = (obj) => obj.getContent() === symbol;
        // rows
        for(row of board) {
            if(row.every(matchingSymbol)) return true;
        }
        // columns
        const columns = [
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
        ];
        for(col of columns) {
            if (col.every(matchingSymbol)) return true;
        }
        // diagonals
        const diagonals = [
            [board[0][0], board[1][1], board[2][2]],
            [board[2][0], board[1][1], board[0][2]],
        ];
        for(diag of diagonals) {
            if (diag.every(matchingSymbol)) return true;
        }
        return false;
    }

    //below are helper functions only for console version, they will be removed later

    const printBoard = () => {
        console.log("printing board");
        const output = board.map((row => (row.map((cell) => cell.getContent()))));
        console.log(output);
    }

    const getCell = (x, y) => board[x][y];

    return {
        placeMarker,
        getBoard,
        winningState,
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
    const player1 = player("John", "X");
    const player2 = player("Jenny", "O");
    const players = [player1, player2];
    const board = gameBoard(3, 3);

    let roundNumber = 0;

    const advanceRound = () => roundNumber++;
    const getActivePlayer = () => players[roundNumber%2];
    const showCurrentRound = () => {
        board.printBoard();
        console.log(`Round ${roundNumber + 1}: ${getActivePlayer().getName()}'s turn`);
    }
    const grabInput = () => {
        const r = prompt("Row number");
        const c = prompt("Column number");
        return [r, c];
    }
    const checkForWinner = () => {
        const currentPlayerMarker = getActivePlayer().getMarker();
        return board.winningState(currentPlayerMarker);
    }
    const playRound = () => {
        showCurrentRound();
        const where = grabInput();
        const cell = board.getCell(...where);
        board.placeMarker(cell, getActivePlayer());
        checkForWinner() ? console.log(`${getActivePlayer().getName()} is a winner`):console.log('game on');
        advanceRound();
        showCurrentRound();
    }

    return {
        playRound,
    }
}

// CELL TESTS
// const empty = cell();
// const x = cell("X");

// console.log(empty.isEmpty());
// console.log(x.isEmpty());
// console.log(x.getContent());
// empty.setContent("O");
// console.log(empty.isEmpty());
// console.log(empty.getContent());

// BOARD TESTS
// const board = gameBoard(3, 3);
// console.log(board.getBoard());
// console.log(board.printBoard());
    // scan rows
// console.log(`all empty: ${board.scanRows("")}`);
// c = board.getCell(1, 0);
// d = board.getCell(1, 1);
// e = board.getCell(1, 2);
// f = board.getCell(2, 0);
// g = board.getCell(2, 1);
// h = board.getCell(2, 2);
// board.placeMarker(c, player("john", "X"));
// board.placeMarker(d, player("john", "X"));
// board.placeMarker(e, player("john", "X"));
// console.log(`all 'x': ${board.scanRows("X")}`);
// board.placeMarker(f, player("jenny", "O"));
// board.placeMarker(g, player("jenny", "O"));
// board.placeMarker(h, player("jenny", "O"));
// console.log(`all 'o': ${board.scanRows("O")}`);
// console.log(board.printBoard());
// console.log(board.getCell(1, 1).getContent());
    // scan cols
// console.log(`all empty: ${board.scanColumns("")}`);
// c = board.getCell(0, 1);
// d = board.getCell(1, 1);
// e = board.getCell(2, 1);
// f = board.getCell(0, 2);
// g = board.getCell(1, 2);
// h = board.getCell(2, 2);
// board.placeMarker(c, player("john", "X"));
// board.placeMarker(d, player("john", "X"));
// board.placeMarker(e, player("john", "X"));
// console.log(`all 'x': ${board.scanColumns("X")}`);
// board.placeMarker(f, player("jenny", "O"));
// board.placeMarker(g, player("jenny", "O"));
// board.placeMarker(h, player("jenny", "O"));
// console.log(`all 'o': ${board.scanColumns("O")}`);
// console.log(board.printBoard());
// console.log(board.getCell(1, 1).getContent());
    // scan diagonals
// console.log(`all empty: ${board.scanDiagonals("")}`);
// c = board.getCell(0, 0);
// d = board.getCell(1, 1);
// e = board.getCell(2, 2);
// f = board.getCell(2, 0);
// g = board.getCell(1, 1);
// h = board.getCell(0, 2);
// board.placeMarker(c, player("john", "X"));
// board.placeMarker(d, player("john", "X"));
// board.placeMarker(e, player("john", "X"));
// console.log(`all 'x': ${board.scanDiagonals("X")}`);
// board.placeMarker(f, player("jenny", "O"));
// board.placeMarker(g, player("jenny", "O"));
// board.placeMarker(h, player("jenny", "O"));
// console.log(`all 'o': ${board.scanDiagonals("O")}`);
// console.log(board.printBoard());
// console.log(board.getCell(1, 1).getContent());

// PLAYER TESTS
// const p1 = player("Michael", "X");
// const p2 = player("Jenny", "O");

// console.log(`Player 1 name: ${p1.getName()}`);
// console.log(`Player 2 marker: '${p2.getMarker()}'`);

// WHOLE GAME (9 ROUNDS)
const game = ticTacToe();
for(let i = 0; i < 9; i++){
    game.playRound()
}