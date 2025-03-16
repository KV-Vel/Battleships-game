/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-return */

import pubsub from "../../utils/PubSub";

export default class Battleship {
    #defaultSettings = {
        initialShipsQuantity: [
            ["4", 1],
            ["3", 2],
            ["2", 3],
            ["1", 4],
        ],
    };

    #statuses = {};

    constructor(player1, player2, randomizer) {
        this.player1 = player1;
        this.player2 = player2;
        this.randomizer = randomizer;
        this.#init();
    }

    startGame() {
        this.#statuses.activePlayer = this.player1;
        this.#statuses.inactivePlayer = this.player2;
    }

    playRound(coordinates) {
        if (this.isGameEnded()) return;
        const { hitResult } = this.#playerAttacks(coordinates);
        const { activePlayer, inactivePlayer } = this.#statuses;

        if (inactivePlayer.gameboard.isAllShipsSunk()) {
            this.#statuses.isMatchEnded = true;
            return `${activePlayer.name} won!`;
        }
        if (hitResult === "miss") this.#decideTurn();
    }

    getActivePlayer() {
        return this.#statuses.activePlayer;
    }

    getInactivePlayer() {
        return this.#statuses.inactivePlayer;
    }

    isGameEnded() {
        return this.#statuses.isMatchEnded;
    }

    playerPlacesShip(coordinates, size) {
        const activePlayer = this.getActivePlayer();
        activePlayer.addShipToBoard(coordinates, size);
    }

    playerPlacesShipsRandomly() {
        const activePlayer = this.getActivePlayer();

        if (!this.randomizer) return "Can't place ship randomly if randomizer undefined";
        // eslint-disable-next-line no-restricted-syntax
        for (const [shipSize, numberOfShips] of activePlayer.shipsQuantity) {
            for (let i = 0; i !== numberOfShips; i += 1) {
                const randomCoordinates = this.randomizer.generateRandomCoordinates(shipSize);
                const shipCoordinates = activePlayer.addShipToBoard(randomCoordinates, shipSize);
                pubsub.publish("randomlyAdd", [randomCoordinates, activePlayer.name]);
                this.randomizer.deleteShipPlacements(shipCoordinates);
            }
        }
        this.randomizer.resetAvailableCoordinates();
        this.#decideTurn();
    }

    #playerAttacks(coordinates) {
        // coordinates are str type — "2,3"
        const [x, y] = coordinates.split(",");

        const inactivePlayer = this.getInactivePlayer();
        const hitResult = inactivePlayer.gameboard.receiveAttack(x, y);

        pubsub.publish("attack", { coordinates: coordinates, playerReceivingHitName: inactivePlayer.name, hitResult });

        return { coordinates: coordinates, playerReceivingHitName: inactivePlayer.name, hitResult };
    }

    #init() {
        // // Setting ships quantity
        this.#initiateShips();
        this.#statuses = {
            activePlayer: null,
            inactivePlayer: null,
            isMatchEnded: false,
        };
        this.startGame();
    }

    #decideTurn() {
        const { activePlayer, inactivePlayer } = this.#statuses;

        this.#statuses.activePlayer = inactivePlayer;
        this.#statuses.inactivePlayer = activePlayer;
    }

    #initiateShips() {
        this.player1.shipsQuantity = new Map(this.#defaultSettings.initialShipsQuantity);
        this.player2.shipsQuantity = new Map(this.#defaultSettings.initialShipsQuantity);
    }
}
