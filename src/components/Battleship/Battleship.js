export default class Battleship {
    defaultSettings = {
        initialShipsQuantity: {
            4: 1,
            3: 2,
            2: 3,
            1: 4,
        },
    };

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.#init();
    }

    startGame() {
        if (!this.#canStartGame) return;

        this.player1.statuses.takingTurn = true; // change this to BE CALLED FROM PLAYER INSTANCE
    }

    #init() {
        this.player1.shipsQuantity = this.defaultSettings.initialShipsQuantity;
        this.player2.shipsQuantity = this.defaultSettings.initialShipsQuantity;
    }

    #canStartGame() {
        return (
            this.player1.statuses.readyToStart &&
            this.player2.statuses.readyToStart
        );
    }

    decideTurn() {}
}
