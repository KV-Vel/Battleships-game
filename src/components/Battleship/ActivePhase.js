/* eslint-disable consistent-return */
import pubsub from "../../utils/PubSub";
import GamePhase from "./AbstractGamePhase";

export default class Battleship extends GamePhase {
    #statuses = {
        isGameEnded: false,
        isGameStarted: false,
    };

    constructor(player1, player2, passDevice) {
        super(player1, player2);
        this.passDevice = passDevice;
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
            this.isGameStarted = true; // create setter
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

        if (this.passDevice && this.#statuses.isGameStarted) {
            this.passDevice.activatePassDevice(this.activePlayer.name, this.inactivePlayer.name);
        }
    }

    #isBothPlayersReady() {
        return this.activePlayer.isReady() && this.inactivePlayer.isReady();
    }
}
