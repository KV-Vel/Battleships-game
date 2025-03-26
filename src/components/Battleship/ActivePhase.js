/* eslint-disable consistent-return */
import pubsub from "../../utils/PubSub";
import GamePhase from "./AbstractGamePhase";

export default class Battleship extends GamePhase {
    #statuses = {
        isGameEnded: false,
        isGameStarted: false,
    };

    playRound(coordinates) {
        if (this.isGameEnded || !this.isGameStarted) return false;
        const attackResultData = this.#playerAttacks(coordinates);
        if (!attackResultData) return;

        const { hitResult } = attackResultData;
        if (hitResult === "miss") this.#switchTurn();

        if (this.inactivePlayer.gameboard.isAllShipsSunk()) {
            this.isGameEnded = true;
            this.isGameStarted = false;
            return `${this.activePlayer.name} won!`;
        }

        if (this.activePlayer.type === "AI") {
            this.playRound(this.activePlayer.generateGuess());
        }
    }

    checkToStartGame() {
        if (this.#isBothPlayersReady()) {
            this.isGameStarted = true; // create setter
            return;
        }
        this.#switchTurn();
    }

    get isGameStarted() {
        return this.#statuses.isGameStarted;
    }

    set isGameStarted(value) {
        if (typeof value !== "boolean") return;
        this.#statuses.isGameStarted = value;
    }

    get isGameEnded() {
        return this.#statuses.isGameEnded;
    }

    set isGameEnded(result) {
        if (typeof result !== "boolean") return;

        this.#statuses.isGameEnded = result;
    }

    #switchTurn() {
        const { inactivePlayer, activePlayer } = this;

        this.activePlayer = inactivePlayer;
        this.inactivePlayer = activePlayer;
    }

    #playerAttacks(coordinates) {
        const hitResult = this.inactivePlayer.gameboard.receiveAttack(coordinates);
        if (!hitResult) return;

        pubsub.publish("attack", { coordinates: coordinates, playerReceivingHitName: this.inactivePlayer.name, hitResult });

        return { coordinates: coordinates, playerReceivingHitName: this.inactivePlayer.name, hitResult };
    }

    #isBothPlayersReady() {
        return this.activePlayer.isReady() && this.inactivePlayer.isReady();
    }
}
