import Ship from "../Ship/ship";
import pubsub from "../../utils/PubSub";

export default class Player {
    // takes instanceof Map object
    #shipsQuantity;

    #shipsQuantityStaticCopy;

    #statuses = {
        readyToStart: false,
    };

    constructor(name, gameboard, randomizer, shipsQuantity) {
        this.name = name;
        this.gameboard = gameboard;
        this.randomizer = randomizer;
        this.#shipsQuantity = new Map(shipsQuantity); // bound to Map
        this.#shipsQuantityStaticCopy = shipsQuantity;
        this.type = "HUMAN";
    }

    attack(enemyGameboard, coordinates) {
        const hitResult = enemyGameboard.receiveAttack(coordinates);
        if (!hitResult) return false;

        return {
            coordinates: coordinates,
            status: hitResult.status,
            blockedCells: hitResult.blockedCells,
        };
    }

    addShipToBoard(coordinates, size) {
        // Checking if player still have this ship size
        if (this.#shipsQuantity.get(size.toString()) === 0) return false;

        const placedValues = this.gameboard.placeShip(coordinates, new Ship(size));
        if (!placedValues) return;

        const [placedShipCoordinates, blockedCoordinates] = placedValues;

        if (placedShipCoordinates) {
            pubsub.publish("addShip", {
                placedShipCoordinates,
                blockedCoordinates,
                name: this.name,
            });
            this.#reduceShipsByOne(size);
            pubsub.publish("updateShipsQuantity", this.shipsQuantity);
        }

        return [placedShipCoordinates, blockedCoordinates];
    }

    addShipsRandomly() {
        if (!this.randomizer) throw new Error("Can't place ship randomly if randomizer undefined");

        // Redeclaring shipsQuantity during each usage of this func
        this.#shipsQuantity = new Map(this.#shipsQuantityStaticCopy);
        this.gameboard.clearBoard();

        for (const [shipSize, numberOfShips] of this.#shipsQuantity) {
            for (let i = 0; i !== numberOfShips; i += 1) {
                const randomCoordinates = this.randomizer.generateRandomCoordinates(shipSize);
                const shipCoordinates = this.addShipToBoard(randomCoordinates, shipSize);
                this.randomizer.deleteShipPlacements(shipCoordinates);
            }
        }

        this.randomizer.resetAvailableCoordinates();
    }

    // Player will be considered "ready" if all his ships are placed
    isReady() {
        // Getting ship quantities of every ship
        const shipNumbers = [...this.#shipsQuantity.values()];
        const isEveryShipPlaced = shipNumbers.every(ship => ship === 0);

        if (isEveryShipPlaced) this.#statuses.readyToStart = true;

        return this.#statuses.readyToStart;
    }

    reset() {
        this.gameboard.clearBoard();
        this.#shipsQuantity = new Map(this.#shipsQuantityStaticCopy);
        this.#statuses.readyToStart = false;
    }

    get shipsQuantity() {
        return this.#shipsQuantity;
    }

    #reduceShipsByOne(size) {
        const strSize = size.toString();
        if (!strSize) return "Can't convert to str";

        const previousValue = this.#shipsQuantity.get(strSize);
        this.#shipsQuantity.set(strSize, previousValue - 1);
    }
}
