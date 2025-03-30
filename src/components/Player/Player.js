import Ship from "../Ship/Ship";
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

    addShipToBoard(coordinates, size) {
        // Checking if player still have this ship size
        if (this.#shipsQuantity.get(size.toString()) === 0) return false;

        const shipCoordinates = this.gameboard.placeShip(coordinates, new Ship(size));
        this.#reduceShipsByOne(size);
        // If placed coordinates return, we notify UI
        if (shipCoordinates) {
            pubsub.publish("addShip", [coordinates, this.name]);
        }
        // Do i need to return here?
        return shipCoordinates;
    }

    addShipsRandomly() {
        // Redeclaring shipsQuantity during each usage of this func
        this.#shipsQuantity = new Map(this.#shipsQuantityStaticCopy);

        if (!this.randomizer) throw new Error("Can't place ship randomly if randomizer undefined");
        // eslint-disable-next-line no-restricted-syntax
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

    #reduceShipsByOne(size) {
        const strSize = size.toString();
        if (!strSize) return "Can't convert to str";

        const initialValue = this.#shipsQuantity.get(strSize);
        this.#shipsQuantity.set(strSize, initialValue - 1);

        if (this.isReady()) pubsub.publish("isReady");
    }
}
