import pubsub from "../../utils/PubSub";

export default class BoardUI {
    boardSelectorsNames = {
        boardRoot: "board__wrapper",
        boardRow: "board__wrapper__row",
        boardCell: "board__cell",
    };

    constructor(boardToPlaceTo) {
        this.boardToPlaceTo = boardToPlaceTo;
    }

    createBoardWrapper(className, name) {
        const boardWrapperEl = document.createElement("div");
        boardWrapperEl.className = className;
        boardWrapperEl.setAttribute("data-belonging", name);

        return boardWrapperEl;
    }

    createBoardRow(className) {
        const rowEl = document.createElement("div");
        rowEl.className = className;

        return rowEl;
    }

    createBoardCell(className, coordinate) {
        const cellEl = document.createElement("div");
        cellEl.className = className;
        cellEl.setAttribute("data-coordinate", coordinate);

        return cellEl;
    }

    createBoard(rows, cols, playerName) {
        const boardWrapper = this.createBoardWrapper(this.boardSelectorsNames.boardRoot, playerName);

        for (let row = 0; row <= rows - 1; row += 1) {
            const boardRow = this.createBoardRow(this.boardSelectorsNames.boardRow);

            for (let col = 0; col <= cols - 1; col += 1) {
                const boardCell = this.createBoardCell(this.boardSelectorsNames.boardCell, `${row},${col}`);

                boardRow.append(boardCell);
            }
            boardWrapper.append(boardRow);
        }

        this.boardToPlaceTo.append(boardWrapper);
    }

    displayShip(data) {
        const [coordinates, name] = data;
        const playersBoard = document.querySelector(`[data-belonging = ${name}]`);
        coordinates.forEach(coordinate => {
            const uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinate}']`);
            uiCell.classList.add("ship-placed");
        });
    }

    createShipUI(length, className) {
        const shipDiv = document.createElement("div");
        shipDiv.setAttribute("data-length", length);
        shipDiv.setAttribute("draggable", true);
        shipDiv.className = className;

        return shipDiv;
    }

    createShipCellUI(className) {
        const shipCell = document.createElement("div");
        shipCell.className = className;

        return shipCell;
    }

    drawShips(shipsQuantity) {
        // Function accept array of arrays [["4", 1]] or Map object
        const shipWrapper = document.createElement("div");
        shipWrapper.className = "ship-wrapper";
        // eslint-disable-next-line no-restricted-syntax
        for (const [shipSize, _] of shipsQuantity) {
            const shipDiv = this.createShipUI(shipSize, "ship");
            for (let j = 0; j < shipSize; j += 1) {
                const shipCell = this.createShipCellUI("cell ship-cell");
                shipDiv.append(shipCell);
            }
            shipWrapper.append(shipDiv);
            this.boardToPlaceTo.append(shipWrapper);
        }

        // Куда-то корабли нужно выводить. Не забыть сделать стили для них, чтобы они накладывались друг на друга
    }

    displayAttackResult(data) {
        const { coordinates, playerReceivingHitName, hitResult } = data;
        const playersBoard = document.querySelector(`[data-belonging = ${playerReceivingHitName}]`);
        const uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinates}']`);
        uiCell.classList.add(hitResult);
    }

    toggleReadyBtn() {
        const readyBtn = document.querySelector(".ready-state-btn");
        readyBtn.toggleAttribute("disabled");
    }
}
