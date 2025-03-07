import Ship from "../Ship/Ship";

export default class Battleship {
    #defaultSettings = {
        initialShipsQuantity: new Map([
            ["4", 1],
            ["3", 2],
            ["2", 3],
            ["1", 4],
        ]),
    };

    constructor(player1, player2, ui) {
        this.player1 = player1;
        this.player2 = player2;
        this.ui = ui;
        this.#init();
    }

    startGame() {
        if (!this.#canStartGame) return;

        this.player1.statuses.takingTurn = true; // change this to BE CALLED FROM PLAYER INSTANCE
    }

    #init() {
        // Setting ships quantity
        this.player1.shipsQuantity = this.#defaultSettings.initialShipsQuantity;
        this.player2.shipsQuantity = this.#defaultSettings.initialShipsQuantity;

        // // Creating boards
        const board1 = this.ui.createBoard(this.player1.gameboard.gameboard);
        const board2 = this.ui.createBoard(this.player2.gameboard.gameboard);

        // MOVE TO SEPARTE METHOD
        const btn = document.querySelector("button");
        btn.addEventListener("click", () => {
            this.onRandomlyPlacedShip();
        });
    }

    #canStartGame() {
        return this.player1.statuses.readyToStart && this.player2.statuses.readyToStart;
    }

    onSelectedPlacedShip() {}

    getActivePlayer() {
       
    }

    onRandomlyPlacedShip() {
        // const activePlayer = this.getActivePlayer();
        // forEach do not preserve order in Map. First random ship should be the biggest one.
        for (const [shipSize, numberOfShips] of this.player1.shipsQuantity) {
            for (let i = numberOfShips; i >= 1; i -= 1) {    
                const [shipCoordinates, blockedCells] =  this.player1.gameboard.placeShipRandomly(new Ship(shipSize));
                this.ui.createAndDisplayShip(shipCoordinates);
                // this.ui.blockCells(blockedCells)

            }
        }
    }

    // addShip(coordinates, player, shipSize) {
    //     // DOM COORDINATES, GETACTIVEPLAYER(), SHIPSIZE
    //     player.gameboard.placeShip(coordinates, new Ship(shipSize));

    //     this.ui.createAndDisplayShip(coordinates);
    // }

    // addRandomShip(player) {
    //     player.gameboard.placeShipsRandomly();
    //     // Уменьшать кол-во кораблей после вставки
    // }

    decideTurn() {}
}
