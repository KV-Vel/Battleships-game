export default class Gameboard {
    #gameboard;

    #attackedCoordinates = [];

    #ships = {
        shipsOnBoard: 0,
        // here will be placed ship identificator and it's surrounding cells
    };

    static #createBoard(rows, cols) {
        return [...Array(rows)].map(() => Array(cols).fill("?"));
    }

    static #isInputValid(coordinates) {
        const coordinatesRegExp = /\d+,\d+/gm;
        return typeof coordinates === "string" && coordinatesRegExp.test(coordinates);
    }

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.#gameboard = Gameboard.#createBoard(this.rows, this.cols);
    }

    placeShip(coordinates, ship) {
        if (coordinates.length !== ship.length) return false;
        if (!this.#isCoordinatesOverflow(coordinates)) return false;
        if (!this.#isCoordinatesFree(coordinates)) return false;

        coordinates.forEach(coordinate => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            this.#gameboard[x][y] = ship;
        });

        this.#ships.shipsOnBoard += 1;

        const blockedCells = this.#surroundShipWithBlockedCells(coordinates);
        // Will be used to surround ship when it is destroyed or placed
        this.#ships[ship.identificator] = {
            blockedCells,
            shipCoordinates: coordinates,
        };

        return [coordinates, blockedCells];
    }

    receiveAttack(coordinates) {
        if (!Gameboard.#isInputValid(coordinates)) return;
        const [x, y] = coordinates.split(",");

        if (!this.#isCellValid(x, y)) return;
        if (this.#attackedCoordinates.includes(coordinates)) return;

        const cell = this.getCell(x, y);
        this.#attackedCoordinates.push(coordinates);

        if (!["?", "X"].includes(cell)) {
            // If we hit then this cell is a ship
            const ship = cell;
            ship.hit();

            if (ship.isSunk()) {
                this.#ships.shipsOnBoard -= 1;
                this.#gameboard[x][y] = "X";

                // If ship is sunk, surrounding it with blockedCells, player can't attack those cells anymore
                const shipBlockingCells = this.#ships[ship.identificator].blockedCells;
                this.#attackedCoordinates.push(...shipBlockingCells);

                return { status: "sunk", blockedCells: shipBlockingCells };
            }
            // after hitting not hitting, cell becomes unavailable
            this.#gameboard[x][y] = "X";
            return { status: "hit", blockedCells: null };
        }

        return { status: "miss", blockedCells: null };
    }

    isAllShipsSunk() {
        return this.#ships.shipsOnBoard === 0;
    }

    getCell(x, y) {
        if (!this.#isCellValid(x, y)) return null;

        return this.#gameboard[x][y];
    }

    clearBoard() {
        this.#gameboard = Gameboard.#createBoard(this.rows, this.cols);
        this.#attackedCoordinates = [];
        this.#ships = {
            shipsOnBoard: 0,
        };
    }

    get myBattleField() {
        return this.#gameboard;
    }

    get quantityOfShips() {
        return this.#ships.shipsOnBoard;
    }

    #getSurroundingShipCells(coordinates) {
        const SHIP_MOVES_OFFSETS = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        const allPossibleCoordinates = SHIP_MOVES_OFFSETS.reduce((acc, [x, y]) => {
            coordinates.forEach(coordinate => {
                const separatedCoordinates = coordinate.split(",");
                let [newX, newY] = separatedCoordinates;

                // Converting string input to number
                newX = Number(newX);
                newY = Number(newY);

                // Filtering only valid surrounding coordinates. e.g ship placed in the corner with negative values close
                if (!this.#isCellValid(x + newX, y + newY)) return;
                if (!["X", "?"].includes(this.getCell(x + newX, y + newY))) return;

                acc.push([x + newX, y + newY].toString());
            });

            return acc;
        }, []);

        // Removing duplicated coordinates
        const set = new Set(allPossibleCoordinates);

        return [...set];
    }

    #surroundShipWithBlockedCells(shipCoordinates) {
        const cellsSurroundingShip = this.#getSurroundingShipCells(shipCoordinates);
        return cellsSurroundingShip.reduce((acc, str) => {
            // converting to array. After being stored in Set
            const separatedNums = str.split(",");
            const [x, y] = separatedNums;

            this.#gameboard[x][y] = "X";

            return [...acc, str];
        }, []);
    }

    #isCoordinatesFree(inputedCoordinates) {
        const freeCoordinates = inputedCoordinates.filter(coordinate => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            const cell = this.getCell(x, y);
            return cell === "?" && cell !== "X";
        });
        return freeCoordinates.length === inputedCoordinates.length;
    }

    #isCoordinatesOverflow(inputedCoordinates) {
        const validCoordinates = inputedCoordinates.filter(coordinate => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            return this.#isCellValid(x, y);
        });

        return validCoordinates.length === inputedCoordinates.length;
    }

    #isCellValid(x, y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }
}
