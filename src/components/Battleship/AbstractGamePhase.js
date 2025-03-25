export default class AbstractGamePhase {
    players = {
        activePlayer: null,
        inactivePlayer: null,
    };

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.#initPlayers(player1, player2);
    }

    get activePlayer() {
        return this.players.activePlayer;
    }

    set activePlayer(player) {
        this.players.activePlayer = player;
    }

    get inactivePlayer() {
        return this.players.inactivePlayer;
    }

    set inactivePlayer(player) {
        this.players.inactivePlayer = player;
    }

    #initPlayers(player1, player2) {
        this.activePlayer = player1;
        this.inactivePlayer = player2;
    }
}
