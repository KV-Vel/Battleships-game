export default class Player {
    shipsQuantity;

    statuses = {
        readyToStart: false,
        takingTurn: false,
    };

    constructor(type, gameboard) {
        this.type = type;
        this.gameboard = gameboard;
    }
}
