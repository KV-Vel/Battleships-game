import pubsub from "../../utils/PubSub";

export default class EventListenerManager {
    selectors = {};

    constructor(game, ui) {
        this.game = game;
        this.ui = ui;

        this.selectors = {
            randomBtn: document.querySelector(".random-ship-placement"),
            boards: document.querySelectorAll(`.${this.ui.selectorsNames.boardRoot}`),
        };

        this.initEvtListeners();
    }

    initEvtListeners() {
        this.selectors.randomBtn.addEventListener("click", () => this.onRandomShipPlacement());
        this.selectors.boards.forEach(board => board.addEventListener("click", e => this.onPlayerAttack(e)));
    }

    onRandomShipPlacement() {
        this.game.playerPlacesShipsRandomly();
    }

    onPlayerAttack(e) {
        const { target } = e;

        const inactivePlayerName = this.game.getInactivePlayer().name;
        const boardBelonging = target.closest(`.${this.ui.selectorsNames.boardRoot}`).dataset.belonging;

        if (boardBelonging !== inactivePlayerName) return;

        if (target.matches(`.${this.ui.selectorsNames.boardCell}`)) {
            const clickedCellCoordinates = target.getAttribute("data-coordinate");

            this.game.playRound(clickedCellCoordinates);
        }
    }
}
