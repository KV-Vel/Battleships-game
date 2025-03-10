import Ship from "../Ship/Ship";

export default class Player {
    // takes instanceof Map object
    #shipsQuantity;

    #statuses = {
        readyToStart: false,
    };

    constructor(name, gameboard) {
        this.name = name;
        this.gameboard = gameboard;
    }

    addShip(coordinates, size) {
        this.gameboard.placeShip(coordinates, new Ship(size));
        this.#reduceShipsQuantity(size);
        this.#isPlayerReady();
    }

    // Will receive ships quantity from outside. Player should know how much ships does he have...
    setShipsQuantity(shipsQuantity) {
        if (!(shipsQuantity instanceof Map)) throw new Error("Object is not type of Map");
        this.#shipsQuantity = shipsQuantity;
    }

    // If will be more statuses, provide argument to make it reusable
    getReadyStatus() {
        return this.#statuses.readyToStart;
    }

    #reduceShipsQuantity(size) {
        const initialValue = this.#shipsQuantity.get(size);
        this.#shipsQuantity.set(size, initialValue - 1);
    }

    #isPlayerReady() {
        // Getting ship quantities of every ship
        const shipNumbers = [...this.#shipsQuantity.values()];
        const isEveryShipPlaced = shipNumbers.every(ship => ship === 0);

        if (isEveryShipPlaced) this.#statuses.readyToStart = true;

        return this.#statuses.readyToStart;
    }
}
