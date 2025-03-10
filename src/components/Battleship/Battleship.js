/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-return */
export default class Battleship {
    #defaultSettings = {
        initialShipsQuantity: new Map([
            ["4", 1],
            ["3", 2],
            ["2", 3],
            ["1", 4],
        ]),
    };

    #statuses = {
        activePlayer: null,
        inActivePlayer: null,
    };

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.#init();
    }

    startGame() {
        this.#statuses.activePlayer = this.player1;
        this.#statuses.inActivePlayer = this.player2;
    }

    playerMakesMove(coordinates) {
        // coordinates are str type — "2,3"
        const [x, y] = coordinates.split(",");
        const { activePlayer, inActivePlayer } = this.#statuses;

        inActivePlayer.gameboard.receiveAttack(x, y);
        if (inActivePlayer.gameboard.isAllShipsSunk()) {
            return `${activePlayer.name} is a Winner!`;
        }

        this.#decideTurn();
    }

    playerPlacesShip() {}

    // Заменить на один метод, но сделать проверку по типу? type active inactive
    getActivePlayer() {
        return this.#statuses.activePlayer;
    }

    getInactivePlayer() {
        return this.#statuses.inActivePlayer;
    }

    #init() {
        // // Setting ships quantity
        // this.player1.shipsQuantity = this.#defaultSettings.initialShipsQuantity;
        // this.player2.shipsQuantity = this.#defaultSettings.initialShipsQuantity;

        // // FOR TEST PURPOSES PLACING SHIPS RANDOMLY
        // this.player1.gameboard.placeShipsRandomly(this.player1.shipsQuantity);
        // this.player2.gameboard.placeShipsRandomly(this.player2.shipsQuantity);

        if (this.#canStartGame) {
            this.startGame();
        }
    }

    #canStartGame() {
        // return this.player1.statuses.readyToStart && this.player2.statuses.readyToStart;
        return true;
    }

    #decideTurn() {
        const { activePlayer, inActivePlayer } = this.#statuses;

        this.#statuses.activePlayer = inActivePlayer;
        this.#statuses.inActivePlayer = activePlayer;
    }
}
