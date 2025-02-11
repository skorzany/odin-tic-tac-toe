function ticTacToe() {
    /* ========== COMPOSITION OBJECTS ========== */
    function player(name, marker) {
        /* ========== LOGIC ========== */
        const myName = name;
        const myMarker = marker;
    
        const getName = () => myName;
        const getMarker = () => myMarker;
    
        return {
            getName,
            getMarker,
        }
    }

    function gameBoard() {
        /* ========== COMPOSITION OBJECTS ========== */
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
        };
        /* ========== LOGIC ========== */
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
    
        const getBoard = () => board;
        const placeMarker = function (cell, marker) {
            if (cell.isEmpty()){
                cell.setMarker(marker);
            }
        }
        const findTriples = function (symbol) {
            let triples = new Set();
            const matchingSymbol = (obj) => obj.getMarker() === symbol;
            // rows
            for(row of board) {
                if(row.every(matchingSymbol)) row.forEach(item => triples.add(item.i));
            }
            // columns
            for(let r = 0; r < ROWNUM; r++) {
                const column = [];
                for(let c = 0; c < COLNUM; c++) {
                    column.push(board[c][r]);
                }
                if(column.every(matchingSymbol)) column.forEach(item => triples.add(item.i));
            }
            // diagonals
            const diagonals = [[], []];
            for(let i = 0; i < ROWNUM; i++) {
                diagonals[0].push(board[i][i]);
                diagonals[1].push(board[i][-i + 2]);
            }
            for(diagonal of diagonals){
                if(diagonal.every(matchingSymbol)) diagonal.forEach(item => triples.add(item.i));
            }
            return triples;
        }
    
        return {
            getBoard,
            placeMarker,
            findTriples,
        }
    }
    /* ========== LOGIC ========== */
    const ROUNDLIMIT = 8;
    let board;
    let roundNumber;
    let currentPlayer;
    let tilesToHighlight;
    let players = [undefined, undefined];

    const button = document.body.querySelector("button");
    const formContainer = document.body.querySelector(".header-bot");
    const form = document.body.querySelector("form");
    const inputs = [...form.querySelectorAll("input[type='text']")];
    const boardContainer = document.body.querySelector(".board");
    const info = document.body.querySelector(".info-box p");
    const viewer = (function () {
        const createBoardView = () => {
            let idx = 0;
            for(row of board.getBoard()) {
                for(obj of row) {
                    obj.i = idx;
                    const newCell = document.createElement("div");
                    newCell.setAttribute("data-idx", idx);
                    newCell.classList.add("cell", "empty");
                    newCell.object = obj;
                    boardContainer.appendChild(newCell);
                    idx += 1;
                }
            }
        }
        const deleteBoardView = () => boardContainer.replaceChildren();
        const showForm = () => formContainer.classList.remove("hidden");
        const hideForm = () => formContainer.classList.add("hidden");
        const clearInputs = () => {
            for(ele of inputs) ele.value = "";
        }
        const showButton = () => button.classList.remove("invisible");
        const hideButton = () => button.classList.add("invisible");
        const updateBoard = () => {
            for(ele of boardContainer.children) {
                const obj = ele.object;
                ele.textContent = obj.getMarker();
                if(!obj.isEmpty()) ele.classList.remove("empty"); 
            }
        }
        const updateInfo = (text) => info.textContent = text;

        return {
            createBoardView,
            deleteBoardView,
            showForm,
            hideForm,
            clearInputs,
            showButton,
            hideButton,
            updateBoard,
            updateInfo,
        }
    })();

    const initialize = () => {
        viewer.updateInfo(createMessage());
        button.addEventListener("click", () => {
            viewer.deleteBoardView();
            viewer.clearInputs();
            viewer.showForm();
            viewer.hideButton();
            viewer.updateInfo(createMessage());
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            viewer.hideForm();
            viewer.showButton();
            newGame();
        });
    }
    const createPlayers = () => {
        const [p1name, p2name] = inputs.map(ele => ele.value);
        players[0] = player(p1name, "X");
        players[1] = player(p2name, "O");
    }
    const advanceRound = () => roundNumber++;
    const setCurrentPlayer = () => currentPlayer = players[roundNumber%2];
    const createMessage = () => {
        let msg;
        if (button.classList.contains("invisible")) msg = "Waiting for player names...";
        else if (!boardContainer.children.length) msg = "Greetings! Click 'Start new game' to play!";
        else {
            if (tilesToHighlight.size) msg = `Game end. ${currentPlayer.getName()} (${currentPlayer.getMarker()}) wins!`;
            else if (ROUNDLIMIT < roundNumber) msg = "Game end. It's a tie!";
            else msg = `It's ${currentPlayer.getName()}'s (${currentPlayer.getMarker()}) turn.`;
        }
        return msg;
    }
    const playRound = (event) => {
        const ele = event.target;
        const symbol = currentPlayer.getMarker();
        if (ele.classList.contains("empty")) {
            ele.classList.remove("empty");
            ele.object.setMarker(symbol);
            viewer.updateBoard();
            if (0.5*ROUNDLIMIT <= roundNumber) tilesToHighlight = board.findTriples(symbol);
            if (tilesToHighlight.size || roundNumber == ROUNDLIMIT + 1) {
                for(child of boardContainer.children) {
                    child.classList.remove("empty");
                    if (tilesToHighlight.has(Number(child.dataset.idx))) child.classList.add("winner");
                }
                viewer.updateInfo(createMessage());
                boardContainer.removeEventListener("click", playRound);
                return;
            }
            advanceRound();
            setCurrentPlayer();
            viewer.updateInfo(createMessage());
        }
    }
    const setDefaultState = () => {
        roundNumber = 0;
        board = gameBoard();
        tilesToHighlight = [];
    }
    const newGame = () => {
        setDefaultState();
        createPlayers();
        setCurrentPlayer();
        viewer.createBoardView();
        viewer.updateInfo(createMessage());
        boardContainer.addEventListener("click", playRound);
    }

    return {
        initialize,
    }
}


// RUN GAME
const game = ticTacToe();
game.initialize();