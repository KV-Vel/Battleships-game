import Player from "./Player";
import getRandomNum from "../../utils/randomNum";

export default class AI extends Player {
    #guesses;

    constructor(name, gameboard, randomizer, shipsQuantity, brains) {
        super(name, gameboard, randomizer, shipsQuantity);
        this.type = "AI";
        this.brains = brains;
        this.#guesses = this.#initPossibleGuesses();
        this.addShipsRandomly();
    }

    attack(enemyGameboard, attackCoordinate) {
        const hitResult = enemyGameboard.receiveAttack(attackCoordinate);
        if (!hitResult) return false;
        let coordinatesToDelete = [attackCoordinate];

        if (hitResult.status === "sunk") {
            coordinatesToDelete = [...hitResult.blockedCells, attackCoordinate];
        }

        if (this.brains) {
            this.brains.handleAttackResult(enemyGameboard, attackCoordinate, this.#guesses, hitResult.status);
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

        // Using 'third argument' to pass guess to resolve
        return new Promise(resolve => {
            setTimeout(resolve, 1200, guess);
        });
    }

    reset() {
        // Calling player reset()
        super.reset();

        if (this.brains) {
            this.brains.resetPossibleSmartGuesses();
        }
        this.#guesses = this.#initPossibleGuesses();
        this.addShipsRandomly();
    }

    #initPossibleGuesses() {
        // AI parsing gameboard cells to formulate possible guesses
        const parsedBoard = this.gameboard.myBattleField.map((row, indexX) => row.map((_, indexY) => [indexX, indexY].join()));

        return parsedBoard.flat();
    }

    #deleteGuess(guessesToDelete) {
        const filtered = this.#guesses.filter(coordinate => !guessesToDelete.includes(coordinate));
        this.#guesses = filtered;
    }
}
