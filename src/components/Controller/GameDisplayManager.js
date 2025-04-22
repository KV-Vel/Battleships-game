import pubsub from "../../utils/PubSub";

export default class EventListenerManager {
    #selectors;

    constructor(game, ui) {
        this.game = game;
        this.ui = ui;

        this.#selectors = {
            randomBtn: document.querySelector(`.${this.ui.buttonSelectorsNames.randomBtn}`),
            boards: document.querySelectorAll(`.${this.ui.boardSelectorsNames.boardRoot} > .board`),
            readyBtn: document.querySelector(`.${this.ui.buttonSelectorsNames.readyBtn}`),
            shipCells: document.querySelectorAll(`.${this.ui.shipSelectorsNames.shipCell}`),
            shipEl: document.querySelectorAll(`.${this.ui.shipSelectorsNames.ship}`),
            tryAgainBtn: document.querySelector(`.${this.ui.buttonSelectorsNames.tryAgainBtn}`),
            btnGroup: document.querySelector(".btn_group"),
        };
    }

    init() {
        this.#selectors.randomBtn.addEventListener("click", () => this.onRandomShipPlacement());
        this.#selectors.readyBtn.addEventListener("click", () => this.onConfirmShipsPlacement());
        this.#selectors.shipEl.forEach(ship => ship.addEventListener("dragstart", e => this.onDragStart(e)));
        this.#selectors.btnGroup.addEventListener("click", e => this.onAxisChange(e));
        this.#selectors.tryAgainBtn.addEventListener("click", () => this.onRestart());
        this.#selectors.boards.forEach(board => {
            board.addEventListener("click", e => this.onPlayerAttack(e));
            board.addEventListener("dragover", e => e.preventDefault());
            board.addEventListener("drop", e => this.onDrop(e));
        });
        this.#selectors.shipCells.forEach(cell => {
            // Apllying class and not using :hover. It's necessary to identify child element which has been dragged
            cell.addEventListener("mouseenter", e => e.target.classList.toggle("active"));
            cell.addEventListener("mouseleave", e => e.target.classList.toggle("active"));
        });
    }

    onShipPlacement(coordinates, size) {
        if (this.game.activePlayer.type === "AI") return;

        const isPlaced = this.game.activePlayer.addShipToBoard(coordinates, size);

        if (this.game.activePlayer.isReady()) {
            this.#selectors.readyBtn.disabled = false;
        }

        return isPlaced;
    }

    onRandomShipPlacement() {
        if (this.game.activePlayer.type === "AI") return;
        this.ui.clearBoard(this.game.activePlayer.name);

        this.game.activePlayer.addShipsRandomly();

        if (this.game.activePlayer.isReady()) {
            this.#selectors.readyBtn.disabled = false;
        }
    }

    onPlayerAttack(e) {
        if (this.game.activePlayer.type === "AI") return;

        const { target } = e;

        const boardBelonging = target.closest(`.${this.ui.boardSelectorsNames.boardRoot}`).dataset.belonging;
        if (boardBelonging !== this.game.inactivePlayer.name) return;

        if (target.matches(`.${this.ui.boardSelectorsNames.boardCell}`)) {
            const clickedCellCoordinates = target.getAttribute("data-coordinate");

            this.game.playRound(clickedCellCoordinates);
        }
    }

    onConfirmShipsPlacement() {
        this.ui.hideBlockedCells(this.game.activePlayer.name);
        this.game.checkToStartGame();
        if (this.game.isGameStarted) {
            this.disableRandomBtn();
        }

        this.toggleReadyBtn();
    }

    onDragStart(e) {
        // Getting cells of dragging ship
        const [...childrens] = e.target.children;
        const findActiveCellIndex = child => child.matches(".active");
        const activeCellIndex = childrens.findIndex(findActiveCellIndex);

        // Passing activeCell
        e.dataTransfer.setData("active", activeCellIndex);
        e.dataTransfer.setData("length", e.target.dataset.length);
        e.dataTransfer.setData("axis", e.target.dataset.axis);
    }

    onDrop(e) {
        e.preventDefault();

        if (this.game.isGameStarted) return;
        // Checking if board where drop happens belong to active player
        const board = e.target.closest(`.${this.ui.boardSelectorsNames.boardRoot}`);
        if (board.dataset.belonging !== this.game.activePlayer.name) return;

        const activeCellIndex = e.dataTransfer.getData("active");
        const shipLength = e.dataTransfer.getData("length");
        const axis = e.dataTransfer.getData("axis");
        const [y, x] = e.target.dataset.coordinate.split(",");

        // Preventing offset ship placement
        if (activeCellIndex === "-1") return;

        // Searching for first coordinate where start of the ship will be, to place it with offset correctly
        const activeAxis = axis === "horizontal" ? x : y;
        const firstCoordinateOfShip = activeAxis - activeCellIndex;

        if (firstCoordinateOfShip < 0) return;

        const coordinatesToPlaceTo = [];

        for (let i = 0; i < shipLength; i += 1) {
            if (axis === "horizontal") {
                coordinatesToPlaceTo.push([y, firstCoordinateOfShip + i].join(","));
            } else {
                coordinatesToPlaceTo.push([firstCoordinateOfShip + i, x].join(","));
            }
        }
        this.onShipPlacement(coordinatesToPlaceTo, shipLength);
    }

    toggleReadyBtn() {
        const readyBtn = document.querySelector(".ready-state-btn");
        readyBtn.toggleAttribute("disabled");
        pubsub.publish("updateShipsQuantity", this.game.activePlayer.shipsQuantity);
    }

    disableRandomBtn() {
        this.#selectors.randomBtn.disabled = true;
    }

    onAxisChange(e) {
        const shipWrapper = document.querySelector(".ship-wrapper");
        const shipQuantityDivs = document.querySelectorAll(".ship-wrapper__quantity");

        if (e.target.matches(".vertical-axis-btn")) {
            shipQuantityDivs.forEach(div => (div.style.flexDirection = "column-reverse"));

            shipWrapper.className = "ship-wrapper vertical";
            this.#selectors.shipEl.forEach(ship => {
                ship.className = "ship horizontal";
                ship.dataset.axis = "vertical";
            });
        }

        if (e.target.matches(".horizontal-axis-btn")) {
            shipQuantityDivs.forEach(div => div.style.flexDirection = "row");

            shipWrapper.className = "ship-wrapper horizontal";
            this.#selectors.shipEl.forEach(ship => {
                ship.className = "ship vertical";
                ship.dataset.axis = "horizontal";
            });
        }
    }

    onTakeTurn() {
        this.game.passDevice.activatePassDevice([this.game.activePlayer.name, this.game.inactivePlayer.name]);
    }

    onRestart() {
        this.game.reset();
        this.#selectors.randomBtn.disabled = false;
        pubsub.publish("updateShipsQuantity", this.game.activePlayer.shipsQuantity);

        const gameResultDialog = document.querySelector(".result-dialog");
        gameResultDialog.close();
    }
}
