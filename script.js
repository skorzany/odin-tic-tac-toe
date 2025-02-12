const ticTacToe = (function () {
    const ROUNDLIMIT = 8;

    let roundNumber;
    let currentPlayer;
    let tilesToHighlight;
    let phase;
    let players = [undefined, undefined];

    const [header, main, _] = document.querySelectorAll("body > *");
    const button = header.querySelector(".content .header-top button");
    const formContainer = header.querySelector(".content .header-bot");
    const form = formContainer.querySelector("form");
    const inputs = [...form.querySelectorAll("input[type='text']")];
    const boardContainer = main.querySelector(".content .board");
    const info = main.querySelector(".content .info-box p");
    const board = (function () {
        const ROWNUM = 3;
        const COLNUM = 3;
        const board = [];
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

        for(let r = 0; r < ROWNUM; r++) {
            const row = [];
            for(let c = 0; c < COLNUM; c++) {
                row.push(cell());
            }
            board.push(row);
        }

        const getBoard = () => board;
        const clear = () => {
            for(let row of board) {
                for(let c = 0; c < COLNUM; c++) {
                    row[c] = cell();
                }
            }
        }
        const placeMarker = function (cell, marker) {
            if(cell.isEmpty()){
                cell.setMarker(marker);
            }
        }
        const findTriples = function (symbol) {
            let triples = new Set();
            const matchingSymbol = (obj) => obj.getMarker() === symbol;
            // rows
            for(let row of board) {
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
            for(let diagonal of diagonals){
                if(diagonal.every(matchingSymbol)) diagonal.forEach(item => triples.add(item.i));
            }
            return triples;
        }

        return {
            getBoard,
            clear,
            placeMarker,
            findTriples,
        }
    })();
    const viewer = (function () {
        const createBoardView = () => {
            let idx = 0;
            for(let row of board.getBoard()) {
                for(let obj of row) {
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
            for(let ele of inputs) ele.value = "";
        }
        const showButton = () => button.classList.remove("invisible");
        const hideButton = () => button.classList.add("invisible");
        const updateBoard = () => {
            for(let ele of boardContainer.children) {
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
    const advanceRound = () => roundNumber++;
    const setCurrentPlayer = () => currentPlayer = players[roundNumber%2];
    const createMessage = () => {
        switch (phase) {
            case "start-new": return "Greetings! Click 'Start new game' to play!";
            case "start-inputs": return "Waiting for player names...";
            case "game": return `It's ${currentPlayer.getName()}'s (${currentPlayer.getMarker()}) turn.`;
            case "end-tie": return "Game end. It's a tie!";
            case "end-winner": return `Game end. ${currentPlayer.getName()} (${currentPlayer.getMarker()}) wins!`;
        }
    }
    const playRound = (event) => {
        const ele = event.target;
        const symbol = currentPlayer.getMarker();
        if(ele.classList.contains("empty")) {
            ele.classList.remove("empty");
            ele.object.setMarker(symbol);
            viewer.updateBoard();
            if(0.5*ROUNDLIMIT <= roundNumber) tilesToHighlight = board.findTriples(symbol);
            if(tilesToHighlight.size) phase = "end-winner";
            else if(roundNumber === ROUNDLIMIT) phase = "end-tie";
            if(phase.includes("end")) {
                for(let child of boardContainer.children) {
                    child.classList.remove("empty");
                    if(tilesToHighlight.has(Number(child.dataset.idx))) child.classList.add("winner");
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
        board.clear();
        tilesToHighlight = [];
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

    return {
        initialize,
    }
})();
ticTacToe.initialize();