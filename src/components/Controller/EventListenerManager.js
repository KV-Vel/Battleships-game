import pubsub from "../../utils/PubSub";
import Battleship from "../Battleship/ActivePhase";

export default class EventListenerManager {
    constructor(gameStage, ui) {
        this.gameStage = gameStage;
        this.ui = ui;

        this.selectors = {
            randomBtn: document.querySelector(".random-ship-placement"),
            boards: document.querySelectorAll(`.${this.ui.boardSelectorsNames.boardRoot}`),
            readyBtn: document.querySelector(".ready-state-btn"),
        };

        this.initEvtListeners();
    }

    initEvtListeners() {
        this.selectors.randomBtn.addEventListener("click", () => this.onRandomShipPlacement());
        this.selectors.boards.forEach(board => board.addEventListener("click", e => this.onPlayerAttack(e)));
        this.selectors.readyBtn.addEventListener("click", () => this.onConfirmShipsPlacement());
    }

    // onShipPlacement(coordinates, size) {
    //     if (this.gameStage.activePlayer.type === "AI") return;

    //     this.gameStage.activePlayer.addShiptoBoard(coordinates, size);
    // }

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
        pubsub.publish("isReady");
    }
}
