import Player from "./Player";
import getRandomNum from "../../utils/randomNum";
import pubsub from "../../utils/PubSub";

export default class AI extends Player {
    #guesses;

    constructor(name, gameboard, randomizer, shipsQuantity) {
        super(name, gameboard, randomizer, shipsQuantity);
        this.type = "AI";
        this.#guesses = this.#initGuesses();
        this.addShipsRandomly();
    }

    generateGuess() {
        const randomNumber = getRandomNum(0, this.#guesses.length);
        const randomCoordinate = this.#guesses[randomNumber];

        this.#deleteGuess(randomCoordinate);
        pubsub.publish("aiCanAttack", randomCoordinate);
        return randomCoordinate;
    }

    #initGuesses() {
        // AI parsing gameboard cells to formulate possible guesses
        const parsedBoard = this.gameboard.myBattleField.map((row, indexX) => row.map((_, indexY) => [indexX, indexY].join()));

        return parsedBoard.flat();
    }

    #deleteGuess(input) {
        this.#guesses = this.#guesses.filter(coordinate => coordinate !== input);
    }
}

// Possibly put place ship random here in player?
