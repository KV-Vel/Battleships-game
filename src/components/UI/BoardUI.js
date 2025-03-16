import pubsub from "../../utils/PubSub";

export default class BoardUI {
    selectorsNames = {
        boardRoot: "board__wrapper",
        boardRow: "board__wrapper__row",
        boardCell: "board__cell",
    };

    constructor(boardToPlaceTo) {
        this.boardToPlaceTo = boardToPlaceTo;
        // const randomBtn = document.querySelector(".random-ship-placement");
        // randomBtn.addEventListener('click', () => {
        //     pubsub.publish('add');
        // })
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
        const boardWrapper = this.createBoardWrapper(this.selectorsNames.boardRoot, playerName);

        for (let row = 0; row <= rows - 1; row += 1) {
            const boardRow = this.createBoardRow(this.selectorsNames.boardRow);

            for (let col = 0; col <= cols - 1; col += 1) {
                const boardCell = this.createBoardCell(this.selectorsNames.boardCell, `${row},${col}`);

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
            uiCell.classList.add("ship");
        });
    }

    displayAttackResult(data) {
        const { coordinates, playerReceivingHitName, hitResult } = data;
        const playersBoard = document.querySelector(`[data-belonging = ${playerReceivingHitName}]`);
        const uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinates}']`);
        uiCell.classList.add(hitResult);
    }
}
