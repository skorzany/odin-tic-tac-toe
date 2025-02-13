const ticTacToe = (function () {
    const ROUND_LIMIT = 8;
    const MIN_WIN_ROUND = 4;

    let roundNumber;
    let currentPlayer;
    let phase;
    let players = [undefined, undefined];

    const [header, main] = document.querySelectorAll("body > *");
    const button = header.querySelector(".content .header-top button");
    const formContainer = header.querySelector(".content .header-bot");
    const form = formContainer.querySelector("form");
    const inputs = [...form.querySelectorAll("input[type='text']")];
    const boardContainer = main.querySelector(".content .board");
    const info = main.querySelector(".content .info-box p");
    const tilesToHighlight = new Set();
    const board = (function () {
        const ROW_NUM = 3;
        const COL_NUM = 3;
        const myBoard = Array(ROW_NUM).fill().map(() => Array(COL_NUM).fill(null));

        function cell() {
            let marker = "";
            let id;

            const getMarker = () => marker;
            const setMarker = (m) => marker = m;
            const getId = () => id;
            const setId = (n) => id = n;
            const isEmpty = () => !marker;

            return {
                getMarker,
                setMarker,
                getId,
                setId,
                isEmpty,
            }
        };
        const getBoard = () => myBoard;
        const cleanState = () => {
            for(let row of myBoard) {
                for(let c = 0; c < COL_NUM; c++) {
                    row[c] = cell();
                }
            }
        }
        const placeMarker = function (cell, marker) {
            if(cell.isEmpty()) cell.setMarker(marker);
        }
        const findTriples = function (symbol) {
            const matchingSymbol = (obj) => obj.getMarker() === symbol;
            const addToSet = (cell) => tilesToHighlight.add(cell.getId());
            // rows
            for(let row of myBoard) {
                if(row.every(matchingSymbol)) row.forEach(addToSet);
            }
            // columns
            for(let r = 0; r < ROW_NUM; r++) {
                const column = [];
                for(let c = 0; c < COL_NUM; c++) {
                    column.push(myBoard[c][r]);
                }
                if(column.every(matchingSymbol)) column.forEach(addToSet);
            }
            // diagonals
            const diagonals = [[], []];
            for(let i = 0; i < ROW_NUM; i++) {
                diagonals[0].push(myBoard[i][i]);
                diagonals[1].push(myBoard[i][-i + 2]);
            }
            for(let diagonal of diagonals){
                if(diagonal.every(matchingSymbol)) diagonal.forEach(addToSet);
            }
        }

        return {
            getBoard,
            cleanState,
            placeMarker,
            findTriples,
        }
    })();
    const viewer = (function () {
        const deleteBoardView = () => boardContainer.replaceChildren();
        const showForm = () => formContainer.classList.remove("hidden");
        const hideForm = () => formContainer.classList.add("hidden");
        const clearInputs = () => inputs.forEach((ele) => ele.value = "");
        const showButton = () => button.classList.remove("invisible");
        const hideButton = () => button.classList.add("invisible");
        const updateInfo = (text) => info.textContent = text;
        const createBoardView = () => {
            let idx = 0;
            for(let row of board.getBoard()) {
                for(let obj of row) {
                    obj.setId(idx);
                    const newCell = document.createElement("div");
                    newCell.classList.add("cell", "empty");
                    newCell.object = obj;
                    boardContainer.appendChild(newCell);
                    idx += 1;
                }
            }
        }
        const updateBoard = () => {
            const triplesFound = !!tilesToHighlight.size;
            for(let ele of boardContainer.children) {
                const obj = ele.object;
                ele.textContent = obj.getMarker();
                if(triplesFound) {
                    ele.classList.remove("empty");
                    if(tilesToHighlight.has(obj.getId())) ele.classList.add("winner");
                }
                else if(!obj.isEmpty()) ele.classList.remove("empty");
            }
        }

        return {
            deleteBoardView,
            showForm,
            hideForm,
            clearInputs,
            showButton,
            hideButton,
            updateInfo,
            createBoardView,
            updateBoard,
        }
    })();

    const initialize = () => {
        phase = "start-new";
        viewer.updateInfo(createMessage());
        button.addEventListener("click", () => {
            phase = "start-inputs";
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
    const newGame = () => {
        phase = "game";
        setDefaultState();
        createPlayers();
        setCurrentPlayer();
        viewer.createBoardView();
        viewer.updateInfo(createMessage());
        boardContainer.addEventListener("click", playRound);
    }
    const setDefaultState = () => {
        roundNumber = 0;
        board.cleanState();
        tilesToHighlight.clear();
    }
    const createPlayers = () => {
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
        const [p1name, p2name] = inputs.map(ele => ele.value);
        players[0] = player(p1name, "X");
        players[1] = player(p2name, "O");
    }
    const setCurrentPlayer = () => currentPlayer = players[roundNumber%2];
    const playRound = (event) => {
        const ele = event.target;
        const symbol = currentPlayer.getMarker();
        if(!ele.matches(".board") && ele.object.isEmpty()) {
            ele.object.setMarker(symbol);
            if(MIN_WIN_ROUND <= roundNumber) board.findTriples(symbol);
            phase = tilesToHighlight.size ? "end-winner" : ((roundNumber === ROUND_LIMIT) ? "end-tie" : phase);
            viewer.updateBoard();
            if(phase.includes("end")) {
                boardContainer.removeEventListener("click", playRound);
                viewer.updateInfo(createMessage());
                return;
            }
            advanceRound();
            setCurrentPlayer();
            viewer.updateInfo(createMessage());
        }
    }
    const createMessage = () => {
        switch (phase) {
            case "start-new": return "Greetings! Click 'Start new game' to play!";
            case "start-inputs": return "Waiting for player names...";
            case "game": return `It's ${currentPlayer.getName()}'s (${currentPlayer.getMarker()}) turn.`;
            case "end-tie": return "Game end. It's a tie!";
            case "end-winner": return `Game end. ${currentPlayer.getName()} (${currentPlayer.getMarker()}) wins!`;
        }
    }
    const advanceRound = () => roundNumber++;

    return {
        initialize,
    }
})();
ticTacToe.initialize();