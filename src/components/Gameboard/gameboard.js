export default class Gameboard {
    #gameboard;
    #ships = {
        shipsOnBoard: 0,
        // here will be placed ship identificator and it's surrounding cells
    };

    constructor() {
        this.rows = 10;
        this.cols = 10;
        this.#gameboard = this.#createBoard(this.rows, this.cols);
    }

    placeShip(coordinates, ship) {
        if (coordinates.length !== ship.length) return false;
        // If not overflowing map
        if (!this.#isCoordinatesValid(coordinates)) return false;
        if (!this.#isCoordinatesFree(coordinates)) return false;

        coordinates.forEach(([x, y]) => {
            this.#gameboard[x][y] = ship;
        });

        this.#ships.shipsOnBoard += 1;

        const blockedCells = this.#surroundShipWithBlockedCells(coordinates);
        // Will be used to circle ship when it is destroyed or placed
        this.#ships[ship.identificator] = blockedCells;

        return true; // do i need to return true here?
    }

    receiveAttack(x, y) {
        if (!this.#isCoordinatesValid([[x, y]])) return;

        if (this.#gameboard[x][y] && this.#gameboard[x][y] !== "X") {
            const ship = this.#gameboard[x][y];
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

    getCell(x, y) {
        if (!this.#isCoordinatesValid([[x, y]])) return null;
        return this.#gameboard[x][y];
    }

    clearBoard() {
        this.#gameboard = this.#createBoard(this.rows, this.cols);
    }

    // @todo placeShipsRandomly(coordinates, shipSize) clear board before this function --> HOW TO MAKE IT PROVIDE ADJACENT CELLS AND ONLY FOR VERTICALL AND HORIZONTAL AXIS
    // ДОБАВИТЬ ТЕСТЫ С ВЕРТИКАЛЬНЫМ РАСПОЛОЖЕНИЕМ КОРАБЛЕЙ!
    placeShipRandomly() {
        const getRandomNum = (max, min) => {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        const [x, y] = [getRandomNum(1, 10), getRandomNum(1, 10)];

        const availableShipPlacements = {
            '4': [],
            '3': [],
            '2': [],
            '1': [],
        }

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const coordinates = this.coordinatesConstructor([i,j]);
                const validRows = coordinates.rows.filter((row) => this.#isCoordinatesValid(row));
                const validCols = coordinates.cols.filter((col) => this.#isCoordinatesValid(col));
                
                // Identical time of iterations, so we can push both rows and cols at the same time
                validRows.forEach(row => {
                    const length = row.length;
                    
                    availableShipPlacements[length].push(row);
                })

                validCols.forEach(col => {
                    const length = col.length;
                    
                    availableShipPlacements[length].push(col);
                })
            }
        }
       
    
    
        
      
    }
    // make data folder for ships e.g. {'Carrier': 4} 4 is length

    coordinatesConstructor = (initialCoords) => {
        const [x, y] = initialCoords;

        const rowsTwo = [initialCoords, [x, y + 1]];
        const rowsThree = [...rowsTwo, [x, y + 2]];
        const rowsFour = [...rowsThree, [x, y + 3]];

        const colsTwo = [initialCoords, [x + 1, y]];
        const colsThree = [...colsTwo, [x + 2, y]];
        const colsFour = [...colsThree, [x + 3, y]];

        return {
            rows: [
                [initialCoords],
                rowsTwo,
                rowsThree,
                rowsFour,
            ],
            cols: [
                [initialCoords],
                colsTwo,
                colsThree,
                colsFour,
            ],
        };
    };

    get gameboard() {
        return this.#gameboard;
    }

    get quantityOfShips() {
        return this.#ships.shipsOnBoard;
    }

    #createBoard(rows, cols) {
        return [...Array(rows)].map(() => Array(cols).fill(false));
    }

    #surroundShipWithBlockedCells(shipCoordinates) {
        const cellsSurroundingShip =
            this.#getSurroundingShipCells(shipCoordinates);
        return cellsSurroundingShip.reduce((acc, str) => {
            //converting to array. After being stored in Set
            const [x, y] = [...str.split(",")];

            this.#gameboard[x][y] = "X";

            return [...acc, [x, y]];
        }, []);
    }

    #getSurroundingShipCells(coordinates) {
        const allPossibleCoordinates = coordinates.reduce((acc, [x, y]) => {
            // mapping possible values around ship
            acc.push([x - 1, y - 1]);
            acc.push([x - 1, y]);
            acc.push([x - 1, y + 1]);
            acc.push([x, y - 1]);
            acc.push([x, y + 1]);
            acc.push([x + 1, y - 1]);
            acc.push([x + 1, y]);
            acc.push([x + 1, y + 1]);

            return acc;
        }, []);

        // Filtering only valid surrounding coordinates. e.g ship placed in the corner with negative values close
        const validSurroundingCoordinates = allPossibleCoordinates.filter(
            ([x, y]) =>
                this.#isCoordinatesValid([[x, y]]) && !this.#gameboard[x][y],
        );

        // Removing duplicated coordinates
        const set = new Set();
        validSurroundingCoordinates.forEach((arr) => set.add(arr.toString()));

        return [...set];
    }

    #isCoordinatesFree = (inputedCoordinates) => {
        const freeCoordinates = inputedCoordinates.filter(
            ([x, y]) => !this.#gameboard[x][y] && this.#gameboard[x][y] !== "X",
        );
        return freeCoordinates.length === inputedCoordinates.length;
    };

    #isCoordinatesValid(inputedCoordinates) {
        const validCoordinates = inputedCoordinates.filter(
            ([x, y]) => x >= 0 && x < this.rows  && y >= 0 && y < this.cols,
        );
        return validCoordinates.length === inputedCoordinates.length;
    }
}
