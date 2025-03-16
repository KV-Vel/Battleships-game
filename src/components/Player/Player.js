import Ship from "../Ship/Ship";

export default class Player {
    // takes instanceof Map object
    shipsQuantity;

    #statuses = {
        readyToStart: false,
    };

    constructor(name, gameboard) {
        this.name = name;
        this.gameboard = gameboard;
    }

    addShipToBoard(coordinates, size) {
        const shipCoordinates = this.gameboard.placeShip(coordinates, new Ship(size));
        this.#reduceShipsByOne(size);

        return shipCoordinates;
    }

    #reduceShipsByOne(size) {
        const initialValue = this.shipsQuantity.get(size);
        this.shipsQuantity.set(size, initialValue - 1);
    }

    isReady() {
        // Getting ship quantities of every ship
        const shipNumbers = [...this.shipsQuantity.values()];
        const isEveryShipPlaced = shipNumbers.every(ship => ship === 0);

        if (isEveryShipPlaced) this.#statuses.readyToStart = true;

        return this.#statuses.readyToStart;
    }
}
