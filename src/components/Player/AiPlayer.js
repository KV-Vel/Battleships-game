import Player from "./Player";
import getRandomNum from "../../utils/randomNum";
import pubsub from "../../utils/PubSub";

export default class AI extends Player {
    #guesses;

    constructor(name, gameboard, randomizer, shipsQuantity, brains) {
        super(name, gameboard, randomizer, shipsQuantity);
        this.type = "AI";
        this.brains = brains;
        this.#guesses = this.#initGuesses();
        this.addShipsRandomly();
    }

    attack(enemyGameboard, attackCoordinate) {
        const hitResult = enemyGameboard.receiveAttack(attackCoordinate);
        if (!hitResult) return false;
        let coordinatesToDelete = [attackCoordinate];

        if (this.brains) {
            if (hitResult.status === "sunk") {
                this.brains.resetPossibleSmartGuesses();
                coordinatesToDelete = [...hitResult.blockedCells, attackCoordinate];
            }

            if (hitResult.status === "hit") {
                this.brains.generatePossibleSmartGuesses(enemyGameboard, attackCoordinate, this.#guesses);
            }
        }

        this.#deleteGuess(coordinatesToDelete);

        return {
            coordinates: attackCoordinate,
            status: hitResult.status,
            blockedCells: hitResult.blockedCells,
        };
    }

    generateGuess() {
        let guess;

        if (this.brains && this.brains.firstHit) {
            guess = this.brains.makeSmartMove();
        } else {
            const randomNumber = getRandomNum(0, this.#guesses.length);
            guess = this.#guesses[randomNumber];
        }

        pubsub.publish("aiCanAttack", guess);

        return guess;
    }

    #initGuesses() {
        // AI parsing gameboard cells to formulate possible guesses
        const parsedBoard = this.gameboard.myBattleField.map((row, indexX) => row.map((_, indexY) => [indexX, indexY].join()));

        return parsedBoard.flat();
    }

    #deleteGuess(guessesToDelete) {
        const filtered = this.#guesses.filter(coordinate => !guessesToDelete.includes(coordinate));
        this.#guesses = filtered;
    }
}
