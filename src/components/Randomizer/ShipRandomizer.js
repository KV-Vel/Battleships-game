import getRandomNum from "../../utils/randomNum";

export default class ShipRandomizer {
    static #traverseAllPossibleCoordinates(x, y) {
        const rowsTwo = [
            [x, y],
            [x, y + 1],
        ];
        const rowsThree = [...rowsTwo, [x, y + 2]];
        const rowsFour = [...rowsThree, [x, y + 3]];

        const colsTwo = [
            [x, y],
            [x + 1, y],
        ];
        const colsThree = [...colsTwo, [x + 2, y]];
        const colsFour = [...colsThree, [x + 3, y]];

        return {
            rows: [[[x, y]], rowsTwo, rowsThree, rowsFour],
            cols: [[[x, y]], colsTwo, colsThree, colsFour],
        };
    }

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.availableShipPlacements = this.#fillRandomShipPlacements(this.cols, this.rows);

        // Copy needed to reset availableShipPlacements to default values, to not make another calculations;
        this.copy = JSON.parse(JSON.stringify(this.availableShipPlacements));
    }

    generateRandomCoordinates(shipSize) {
        // getting array of available coordinates for inputed shipSize
        const shipAvailableCoordinates = this.availableShipPlacements[shipSize];
        const maxNumToRandomize = shipAvailableCoordinates.length;
        const randomNum = getRandomNum(0, maxNumToRandomize);

        return shipAvailableCoordinates[randomNum];
    }

    deleteShipPlacements(deletingCoordinates) {
        if (!(deletingCoordinates instanceof Array)) return;

        // deletingCoordinates include shipPlacement and cells around the ship
        const joinedDeletingCoordinates = deletingCoordinates.flat();
        const availableCoordinatesEntries = Object.entries(this.availableShipPlacements);

        for (const [length, coordinate] of availableCoordinatesEntries) {
            // deleting used coordinates
            const unusedCoordinates = coordinate.filter(arr => !arr.some(value => joinedDeletingCoordinates.includes(value)));
            this.availableShipPlacements[length] = unusedCoordinates;
        }
    }

    resetAvailableCoordinates() {
        // Rerunning #fillRandomShipPlacements will spike CPU usage. Making deep clone instead
        this.availableShipPlacements = JSON.parse(JSON.stringify(this.copy));
    }

    #fillRandomShipPlacements(boardCols, boardRows) {
        const shipPlacements = {
            4: [],
            3: [],
            2: [],
            1: [],
        };

        for (let i = 0; i < boardCols; i += 1) {
            for (let j = 0; j < boardRows; j += 1) {
                const allCoordinates = ShipRandomizer.#traverseAllPossibleCoordinates(i, j);

                const validRows = allCoordinates.rows.filter(row => this.#isCoordinatesValid(row));
                const validCols = allCoordinates.cols.filter(col => this.#isCoordinatesValid(col));

                const validCoordinates = [...validRows, ...validCols];

                // Filling up availableShipPlacements object
                validCoordinates.forEach(coordinate => {
                    const shipLength = coordinate.length;
                    const coordinatesToStr = coordinate.reduce((acc, el) => [...acc, el.toString()], []);
                    shipPlacements[shipLength].push(coordinatesToStr);
                });
            }
        }

        return shipPlacements;
    }

    #isCoordinatesValid(inputedCoordinates) {
        const validCoordinates = inputedCoordinates.filter(([x, y]) => x >= 0 && x < this.rows && y >= 0 && y < this.cols);
        return validCoordinates.length === inputedCoordinates.length;
    }
}
