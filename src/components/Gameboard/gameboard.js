    // @todo placeShipsRandomly(coordinates, shipSize) clear board before this function 

export default class Gameboard {
    #gameboard;
    #ships = {
        shipsOnBoard: 0,
        // here will be placed ship identificator and it's surrounding cells
    };
    
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        // this.randomizer = randomizer;
        this.#gameboard = this.#createBoard(this.rows, this.cols);
    }

    placeShip(coordinates, ship) {
        if (coordinates.length !== ship.length) return false;
        // If not overflowing map
        if (!this.#isCoordinatesValid(coordinates)) return false;
        if (!this.#isCoordinatesFree(coordinates)) return false;

        coordinates.forEach((coordinate) => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            this.#gameboard[x][y] = ship;
        });

        this.#ships.shipsOnBoard += 1;

        const blockedCells = this.#surroundShipWithBlockedCells(coordinates);
        // Will be used to circle ship when it is destroyed or placed
        this.#ships[ship.identificator] = blockedCells;

        return { coordinates, blockedCells };
    }

    placeShipRandomly(ship) {
        const randomCoordinates = this.randomizer.generateRandomCoordinates(
            ship.length,
        );
        const shipCoordinates = this.placeShip(randomCoordinates, ship);
    }

    receiveAttack(x,y) {
        if (!this.#isCellValid(x,y)) return; 

        const cell = this.getCell(x,y);

        if (!['?', 'X'].includes(cell)) {
            const ship = this.getCell(x,y);
            ship.hit();

            if (ship.isSunk()) {
                this.#ships.shipsOnBoard -= 1;
                // this.#ships[ship.identificator];
            }
        }

        // after hitting one piece of Ship or not hitting, cell becomes unavailable
        this.#gameboard[x][y] = "X";
    }

    isAllShipsSunk() {
        return this.#ships.shipsOnBoard === 0;
    }

    getCell(x,y) {
        if (!this.#isCellValid(x,y)) return;

        return this.#gameboard[x][y];
    }

    clearBoard() {
        this.#gameboard = this.#createBoard(this.rows, this.cols);
    }

    get gameboard() {
        return this.#gameboard;
    }

    get quantityOfShips() {
        return this.#ships.shipsOnBoard;
    }

    #createBoard(rows, cols) {
        return [...Array(rows)].map(() => Array(cols).fill('?'));
    }

    #surroundShipWithBlockedCells(shipCoordinates) {
        const cellsSurroundingShip =
            this.#getSurroundingShipCells(shipCoordinates);
        return cellsSurroundingShip.reduce((acc, str) => {
            //converting to array. After being stored in Set
            const separatedNums = str.split(",");
            const [x, y] = separatedNums;

            this.#gameboard[x][y] = "X";

            return [...acc, str];
        }, []);
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

        const allPossibleCoordinates = SHIP_MOVES_OFFSETS.reduce((acc, [x,y]) => {

            for (const coordinate of coordinates) {
                const separatedCoordinates = coordinate.split(',');
                let [newX, newY] = separatedCoordinates;

                // Converting string input to number
                newX = Number(newX);
                newY = Number(newY);

                // Filtering only valid surrounding coordinates. e.g ship placed in the corner with negative values close
                if (!this.#isCellValid(x + newX, y + newY)) continue;
                if (!['X', '?'].includes(this.getCell(x + newX, y + newY))) continue;

                acc.push([x + newX, y + newY].toString());
            }

            return acc;
        }, []);

        // Removing duplicated coordinates
        const set = new Set(allPossibleCoordinates);

        return [...set];
    }

    #isCoordinatesFree = (inputedCoordinates) => {
        const freeCoordinates = inputedCoordinates.filter((coordinate) => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            const cell = this.getCell(x,y)

            return cell === '?' && cell !== "X";
        });
        return freeCoordinates.length === inputedCoordinates.length;
    };

    #isCoordinatesValid(inputedCoordinates) {
        const validCoordinates = inputedCoordinates.filter((coordinate) => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            return this.#isCellValid(x,y);
        });
            
        return validCoordinates.length === inputedCoordinates.length;
    }

    #isCellValid(x,y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }
}
