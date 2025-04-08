import pubsub from "../../utils/PubSub";

export default class EventListenerManager {
    constructor(gameStage, ui) {
        this.gameStage = gameStage;
        this.ui = ui;

        this.selectors = {
            randomBtn: document.querySelector(".random-ship-placement"),
            boards: document.querySelectorAll(`.${this.ui.boardSelectorsNames.boardRoot}`),
            readyBtn: document.querySelector(".ready-state-btn"),
            // Possible move to boardUI and get from there
            shipCells: document.querySelectorAll(".ship-cell"),
            shipEl: document.querySelectorAll(".ship"),
            btnGroup: document.querySelector(".btn_group"),
        };

        this.initEvtListeners();
    }

    initEvtListeners() {
        this.selectors.randomBtn.addEventListener("click", () => this.onRandomShipPlacement());
        this.selectors.readyBtn.addEventListener("click", () => this.onConfirmShipsPlacement());
        this.selectors.shipEl.forEach(ship => ship.addEventListener("dragstart", e => this.onDragStart(e)));
        this.selectors.btnGroup.addEventListener("click", e => this.onAxisChange(e));
        this.selectors.boards.forEach(board => {
            board.addEventListener("click", e => this.onPlayerAttack(e));
            board.addEventListener("dragover", e => this.onDragOver(e));
            board.addEventListener("drop", e => this.onDrop(e));
        });
        this.selectors.shipCells.forEach(cell => {
            // Apllying class and not using :hover. It's needed to identify child element which has been dragged
            cell.addEventListener("mouseenter", e => e.target.classList.toggle("active"));
            cell.addEventListener("mouseleave", e => e.target.classList.toggle("active"));
        });
    }

    onShipPlacement(coordinates, size) {
        if (this.gameStage.activePlayer.type === "AI") return;
        // Make placing ships on enemys board forbidden

        this.gameStage.activePlayer.addShipToBoard(coordinates, size);
    }

    onRandomShipPlacement() {
        if (this.gameStage.activePlayer.type === "AI") return;

        this.gameStage.activePlayer.addShipsRandomly();
    }

    onPlayerAttack(e) {
        if (this.gameStage.activePlayer.type === "AI") return;

        const { target } = e;

        const boardBelonging = target.closest(`.${this.ui.boardSelectorsNames.boardRoot}`).dataset.belonging;
        if (boardBelonging !== this.gameStage.inactivePlayer.name) return;

        if (target.matches(`.${this.ui.boardSelectorsNames.boardCell}`)) {
            const clickedCellCoordinates = target.getAttribute("data-coordinate");

            this.gameStage.playRound(clickedCellCoordinates);
        }
    }

    onConfirmShipsPlacement() {
        this.gameStage.checkToStartGame();

        if (this.gameStage.activePlayer.type === "AI") {
            this.gameStage.activePlayer.addShipsRandomly();
            this.gameStage.checkToStartGame();
        } else {
            pubsub.publish("isReady");
        }
    }

    onDragStart(e) {
        // e.dataTransfer.effectAllowed = "move";
        // Getting cells of dragging ship
        const [...childrens] = e.target.children;
        const findActiveCellIndex = child => child.matches(".active");
        const activeCellIndex = childrens.findIndex(findActiveCellIndex);

        // Passing activeCell
        e.dataTransfer.setData("active", activeCellIndex);
        e.dataTransfer.setData("length", e.target.dataset.length);
        e.dataTransfer.setData("axis", e.target.dataset.axis);
    }

    onDragOver(e) {
        e.preventDefault();
        // e.dataTransfer.dropEffect = "move";
    }

    onDrop(e) {
        e.preventDefault();

        const activeCellIndex = e.dataTransfer.getData("active");
        const shipLength = e.dataTransfer.getData("length");
        const axis = e.dataTransfer.getData("axis");
        const [x, y] = e.target.dataset.coordinate.split(",");

        // Searching for first coordinate where start of the ship will be, to place it with offset correctly
        const activeAxis = axis === "horizontal" ? y : x;
        const firstCoordinateOfShip = activeAxis - activeCellIndex;

        if (firstCoordinateOfShip < 0) return;

        // Тут добавить if про горизонтально или вертикально
        const result = [];

        for (let i = 0; i < shipLength; i += 1) {
            if (axis === "horizontal") {
                result.push([x, firstCoordinateOfShip + i].join(","));
            } else {
                result.push([firstCoordinateOfShip + i, y].join(","));
            }
        }

        this.onShipPlacement(result, shipLength);
    }

    onAxisChange(e) {
        if (e.target.matches(".vertical-axis-btn")) {
            this.selectors.shipEl.forEach(ship => {
                ship.style.cssText = "flex-direction: column;";
                ship.dataset.axis = "vertical";
            });
        }
    }

    // activatePassDevice(inactivePlayerName) {
        
    //     const stash = {
    //         shipCells: [],
    //         blockedCells: [],
    //     };
    //     const playersBoard = document.querySelector(`[data-belonging = ${inactivePlayerName}]`);
    //     const shipCells = playersBoard.querySelectorAll(".ship-placed");
    //     const blockedCells = playersBoard.querySelectorAll(".blocked");

    //     shipCells.forEach(cell => stash.shipCells.push(cell.dataset.coordinate));
    //     blockedCells.forEach(cell => stash.blockedCells.push(cell.dataset.coordinate));

    //     console.log(stash);
    // }
}
