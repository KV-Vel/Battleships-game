/* eslint-disable consistent-return */
import pubsub from "../../utils/PubSub";
import GamePhase from "./AbstractGamePhase";

export default class Battleship extends GamePhase {
    #statuses = {
        isGameEnded: false,
        isGameStarted: false,
    };

    constructor(player1, player2, mode) {
        super(player1, player2);
        this.mode = mode;
    }

    async playRound(coordinates) {
        if (this.isGameEnded || !this.isGameStarted) return false;

        const attackResultData = this.activePlayer.attack(this.inactivePlayer.gameboard, coordinates);
        if (!attackResultData) return;

        const { status } = attackResultData;

        pubsub.publish("attack", {
            playerReceivingHitName: this.inactivePlayer.name,
            ...attackResultData,
        });

        if (this.inactivePlayer.gameboard.isAllShipsSunk()) {
            this.isGameEnded = true;
            pubsub.publish("gameEnded", this.activePlayer.name);
            this.isGameStarted = false;
            return `${this.activePlayer.name} won!`;
        }

        if (status === "miss") {
            this.#switchTurn();
        }

        if (this.activePlayer.type === "AI") {
            const guess = await this.activePlayer.generateGuess();
            this.playRound(guess);
        }
    }

    checkToStartGame() {
        if (this.#isBothPlayersReady()) {
            this.isGameStarted = true;

            if (this.mode === "pvp") {
                this.#switchTurn();
            }

            return this.isGameStarted;
        }

        this.#switchTurn();
    }

    reset() {
        this.isGameEnded = false;
        this.isGameStarted = false;
        this.activePlayer = this.player1;
        this.inactivePlayer = this.player2;

        this.activePlayer.reset();
        this.inactivePlayer.reset();

        pubsub.publish("reset", [this.activePlayer.name, this.inactivePlayer.name, this.isGameStarted]);
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

        pubsub.publish("takeTurn", [this.activePlayer.name, this.inactivePlayer.name, this.isGameStarted]);
    }

    #isBothPlayersReady() {
        return this.activePlayer.isReady() && this.inactivePlayer.isReady();
    }
}
