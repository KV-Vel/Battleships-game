import pubsub from "../../utils/PubSub";

export default class BoardUI {
    static createBoardWrapper(className, name) {
        const boardWrapperEl = document.createElement("div");
        boardWrapperEl.className = className;
        boardWrapperEl.setAttribute("data-belonging", name);

        const playerTag = document.createElement("div");
        playerTag.textContent = name;
        playerTag.className = "player-tag";

        boardWrapperEl.append(playerTag);

        return boardWrapperEl;
    }

    static createBoardRow(className) {
        const rowEl = document.createElement("div");
        rowEl.className = className;

        return rowEl;
    }

    static createBoardCell(className, coordinate) {
        const cellEl = document.createElement("div");
        cellEl.className = className;
        cellEl.setAttribute("data-coordinate", coordinate);

        return cellEl;
    }

    static createAxisWithLettersOrNumbers(arr, axis) {
        const div = document.createElement("div");
        div.className = `axis-cell-wrapper ${axis}`;

        arr.forEach(el => {
            const cell = document.createElement("div");
            cell.className = "axis-cell";
            cell.textContent = el;
            div.append(cell);
        });

        return div;
    }

    static drawShipUI(length, className) {
        const shipDiv = document.createElement("div");
        shipDiv.setAttribute("data-length", length);
        shipDiv.setAttribute("draggable", true);
        shipDiv.setAttribute("data-axis", "horizontal");
        shipDiv.className = className;

        return shipDiv;
    }

    static drawShipCellUI(className) {
        const shipCell = document.createElement("div");
        shipCell.className = className;

        return shipCell;
    }

    constructor(boardToPlaceTo) {
        this.boardToPlaceTo = boardToPlaceTo;

        this.boardSelectorsNames = {
            boardRoot: "board__wrapper",
            boardRow: "board__wrapper__row",
            boardCell: "board__cell",
        };

        this.buttonSelectorsNames = {
            randomBtn: "random-ship-placement",
            readyBtn: "ready-state-btn",
            tryAgainBtn: "try-again_btn",
        };

        this.shipSelectorsNames = {
            shipCell: "ship-cell",
            ship: "ship",
        };

        pubsub.subscribe("addShip", this.displayShip.bind(this));
        pubsub.subscribe("attack", this.displayAttackResult.bind(this));
        pubsub.subscribe("updateShipsQuantity", this.displayShipsQuantity.bind(this));
        pubsub.subscribe("gameEnded", this.showResultDialog.bind(this));
        pubsub.subscribe("takeTurn", this.#highlightActivePlayer.bind(this));
        pubsub.subscribe("reset", this.reset.bind(this));
    }

    createBoard(rows, cols, playerName) {
        const board = document.createElement("div");
        board.className = "board";

        const axisLetters = BoardUI.createAxisWithLettersOrNumbers(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], "vertical");
        const axisNumbers = BoardUI.createAxisWithLettersOrNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "horizontal");

        const boardWrapper = BoardUI.createBoardWrapper(this.boardSelectorsNames.boardRoot, playerName);
        boardWrapper.append(axisNumbers, axisLetters);

        for (let row = 0; row <= rows - 1; row += 1) {
            const boardRow = BoardUI.createBoardRow(this.boardSelectorsNames.boardRow);

            for (let col = 0; col <= cols - 1; col += 1) {
                const boardCell = BoardUI.createBoardCell(this.boardSelectorsNames.boardCell, `${row},${col}`);

                boardRow.append(boardCell);
            }
            board.append(boardRow);
        }
        boardWrapper.append(board);
        this.boardToPlaceTo.append(boardWrapper);
    }

    displayShip(data) {
        const { placedShipCoordinates, blockedCoordinates, name } = data;
        const playersBoard = document.querySelector(`[data-belonging = ${name}]`);
        placedShipCoordinates.forEach(coordinate => {
            const uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinate}']`);
            uiCell.classList.add("ship-placed");
        });
        blockedCoordinates.forEach(cell => {
            const uiCell = playersBoard.querySelector(`[data-coordinate = '${cell}']`);
            uiCell.classList.add("blocked");
        });
    }

    displayAttackResult(data) {
        const { coordinates, playerReceivingHitName, status, blockedCells } = data;
        const playersBoard = document.querySelector(`[data-belonging = ${playerReceivingHitName}]`);
        let uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinates}']`);
        uiCell.classList.add(status);

        if (blockedCells) {
            blockedCells.forEach(cell => {
                uiCell = playersBoard.querySelector(`[data-coordinate = '${cell}'`);
                uiCell.classList.add("miss");
            });
        }
    }

    clearBoard(playerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${playerName}]`);

        const cellsOfBoard = playersBoard.querySelectorAll(`.${this.boardSelectorsNames.boardCell}`);
        cellsOfBoard.forEach(cell => {
            cell.className = this.boardSelectorsNames.boardCell;
        });
    }

    displayUI(data) {
        this.createBoard(10, 10, data.firstPlayerName);
        this.createBoard(10, 10, data.secondPlayerName);

        const shipWrapper = this.#drawShips(data.shipsQuantity);
        const btnGroup = this.#createBoardBtns();

        const controlDiv = document.createElement("div");
        controlDiv.className = `control-group`;
        controlDiv.append(shipWrapper, btnGroup);

        const board = document.querySelector(`.${this.boardSelectorsNames.boardRoot}`);
        board.insertAdjacentElement("afterend", controlDiv);

        this.#highlightActivePlayer([data.firstPlayerName, data.secondPlayerName]);

        this.createResultDialog();
    }

    displayShipsQuantity(shipsQuantity) {
        for (const [key, value] of shipsQuantity) {
            const shipQuantity = document.querySelector(`[data-length = '${key}'] + .quantity`);
            shipQuantity.textContent = `×${value}`;
        }
    }

    createResultDialog() {
        const resultDialog = document.createElement("dialog");
        resultDialog.className = "result-dialog";
        const dialogWrapper = document.createElement("div");

        const paragraph = document.createElement("p");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = this.buttonSelectorsNames.tryAgainBtn;
        btn.textContent = "Try again?";

        dialogWrapper.append(paragraph, btn);
        resultDialog.append(dialogWrapper);

        const controlGroup = document.querySelector(".control-group");
        controlGroup.append(resultDialog);
    }

    showResultDialog(winnerName) {
        const resultDialog = document.querySelector(".result-dialog");
        const paragraph = resultDialog.querySelector("p");
        paragraph.textContent = `${winnerName} has won!`;
        resultDialog.show();
    }

    reset(data) {
        const [activePlayerName, inactivePlayerName] = data;

        [activePlayerName, inactivePlayerName].forEach(playerName => {
            this.clearBoard(playerName);
        });
        this.#highlightActivePlayer([activePlayerName, inactivePlayerName]);
    }

    hideBlockedCells(inactivePlayerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${inactivePlayerName}]`);
        const blockedCellsOfPlayerBoard = playersBoard.querySelectorAll(".blocked");
        blockedCellsOfPlayerBoard.forEach(cell => {
            cell.classList.remove("blocked");
        });
    }

    #drawShips(shipsData) {
        // Function accept array of arrays [["4", 1]] or Map object
        const shipWrapper = document.createElement("div");
        shipWrapper.className = "ship-wrapper horizontal";

        for (const [shipSize, quantity] of shipsData) {
            const shipWrapperQuantity = document.createElement("div");
            shipWrapperQuantity.className = "ship-wrapper__quantity";
            const span = document.createElement("span");
            span.className = "quantity";
            span.textContent = `×${quantity}`;

            const shipDiv = BoardUI.drawShipUI(shipSize, `${this.shipSelectorsNames.ship} vertical`);
            for (let j = 0; j < shipSize; j += 1) {
                const shipCell = BoardUI.drawShipCellUI(`cell ${this.shipSelectorsNames.shipCell}`);
                shipDiv.append(shipCell);
            }
            shipWrapperQuantity.append(shipDiv, span);
            shipWrapper.append(shipWrapperQuantity);
        }
        return shipWrapper;
    }

    #createBoardBtns() {
        const div = document.createElement("div");
        div.className = "btn_group";

        div.innerHTML = `
            <button class=${this.buttonSelectorsNames.randomBtn} type="button">Randomize ships</button>
            <button class=${this.buttonSelectorsNames.readyBtn} type="button" disabled=true>Ready</button>
            <button class="horizontal-axis-btn" type="button">
                <i class="fa-solid fa-left-right" style="color:#fff"></i>
            </button>
            <button class="vertical-axis-btn" type="button">
                <i class="fa-solid fa-up-down" style="color:#fff"></i>
            </button>`;

        return div;
    }

    #highlightActivePlayer(data) {
        const [activePlayerName, inactivePlayerName] = data;

        const playerTagActive = document.querySelector(`[data-belonging = '${activePlayerName}'] > .player-tag`);
        playerTagActive.classList.add("highlight");

        this.#removeHighlight(inactivePlayerName);
    }

    #removeHighlight(playerName) {
        const playerTagInactive = document.querySelector(`[data-belonging = '${playerName}'] > .player-tag`);
        playerTagInactive.classList.remove("highlight");
    }
}
