export default class BoardUI {
    selectorsNames = {
        boardRoot: "board__wrapper",
        boardRow: "board__wrapper__row",
        boardCell: "board__cell",
    };

    constructor() {}

    onClick(e) {
        const { target } = e;

        if (target.matches(".board__cell")) {
            console.log(target.getAttribute("data-coordinate"));
        }
    }

    createBoardWrapper(className) {
        const boardWrapperEl = document.createElement("div");
        boardWrapperEl.className = className;
        boardWrapperEl.addEventListener("click", (e) => this.onClick(e));

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

    createBoard(playerBoard) {
        const boardWrapper = this.createBoardWrapper(
            this.selectorsNames.boardRoot,
        );

        playerBoard.forEach((row, rowIndex) => {
            const boardRow = this.createBoardRow("board__wrapper__row");

            row.forEach((cell, cellIndex) => {
                const boardCell = this.createBoardCell(
                    "board__cell",
                    `${rowIndex},${cellIndex}`,
                );

                boardRow.append(boardCell);
            });

            boardWrapper.append(boardRow);
        });

        return boardWrapper;
    }
}
