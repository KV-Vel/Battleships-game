import Gameboard from "../../../src/components/Gameboard/Gameboard";
import Ship from "../../../src/components/Ship/Ship";

let gameboard;

beforeEach(() => {
    gameboard = new Gameboard(10, 10);
});

describe("Ship placement function", () => {
    test("plaseShip values cant be bigger or smaller than the board size", () => {
        expect(gameboard.placeShip(["11,2"], new Ship(1))).toBe(false);
        expect(gameboard.placeShip(["0,12"], new Ship(1))).toBe(false);
        expect(gameboard.placeShip(["-1,-11"], new Ship(1))).toBe(false);
        expect(gameboard.placeShip(["-1, 2"], new Ship(1))).toBe(false);
        expect(gameboard.placeShip(["0, -5"], new Ship(1))).toBe(false);
    });

    test("smallest ship (1 cell) can be placed on unoccupied cell", () => {
        gameboard.placeShip(["0,0"], new Ship(1));
        expect(gameboard.getCell(0, 0)).toBeInstanceOf(Object);
    });

    test("trying to place ship on surrounding or adjacent to another ship cell should return false and ship shouldnt be placed", () => {
        gameboard.placeShip(["0,0"], new Ship(1));
        expect(gameboard.placeShip(["0,1"], new Ship(1))).toBe(false);

        gameboard.placeShip(["4,5", "5,5"], new Ship(2));
        expect(gameboard.placeShip(["5,6"], new Ship(1))).toBe(false);
    });

    test("not sorted coordinates should also be a valid input", () => {
        // Instead of [1,1] [1,2]
        gameboard.placeShip(["1,2", "1,1"], new Ship(2));

        expect(gameboard.getCell(1, 2)).toBeInstanceOf(Object);
        expect(gameboard.getCell(1, 1)).toBeInstanceOf(Object);

        gameboard.placeShip(["3,2", "3,1", "3,3"], new Ship(3));
        expect(gameboard.getCell(3, 2)).toBeInstanceOf(Object);
        expect(gameboard.getCell(3, 1)).toBeInstanceOf(Object);
        expect(gameboard.getCell(3, 3)).toBeInstanceOf(Object);
    });
});

describe("Receive attack function", () => {
    test("if one piece of at least 2 cell ship got hit, the cell where it has been hit becomes X and If there was not a ship it is still has to be X ", () => {
        gameboard.placeShip(["2,3", "2,4", "2,5"], new Ship(3));
        gameboard.receiveAttack("2,3");
        gameboard.receiveAttack("2,3");

        expect(gameboard.getCell(2, 3)).toBe("X");
        expect(gameboard.getCell(2, 2)).toBe("X");

        gameboard.placeShip(["6,2", "7,2"], new Ship(2));

        gameboard.receiveAttack("7,2");

        expect(gameboard.getCell(7, 2)).toBe("X");
    });

    test("receiving attack out of the map coordinates should return nothing", () => {
        gameboard.placeShip(["2,3"], new Ship(1));

        expect(gameboard.receiveAttack("-1,11")).toBeUndefined();
        expect(gameboard.receiveAttack("0,11")).toBeUndefined();
        expect(gameboard.receiveAttack("-5,5")).toBeUndefined();
    });

    test("ship that received fatall damage should be equal to sunk and number of ships on board should be decreased", () => {
        gameboard.placeShip(["2,3", "2,2"], new Ship(2));
        gameboard.receiveAttack("2,3");

        // checking next cell where ship is, because current cells will become unavailable
        expect(gameboard.getCell(2, 2).hitTimes).toBe(1);
        expect(gameboard.quantityOfShips).toBe(1);

        gameboard.receiveAttack("2,2");

        expect(gameboard.quantityOfShips).toBe(0);
    });

    test("receiving attack on already attacked cells should not count", () => {
        gameboard.placeShip(["2,3", "2,2"], new Ship(2));
        expect(gameboard.receiveAttack("2,3")).toBeDefined();
        expect(gameboard.receiveAttack("2,3")).toBeFalsy();
    });

    test("providing invalid input to receiveAttack should return undefined", () => {
        gameboard.placeShip(["2,3", "2,2"], new Ship(2));
        expect(gameboard.receiveAttack([2, 3])).toBeUndefined();
        expect(gameboard.receiveAttack({ x: 2, y: 3 })).toBeUndefined();
        expect(gameboard.receiveAttack(23)).toBeUndefined();
    });
});

describe("getCell function", () => {
    test("getting board cell with placed ship will return Object", () => {
        gameboard.placeShip(["0,0"], new Ship(1));
        expect(gameboard.getCell(0, 0)).toBeInstanceOf(Object);
    });

    test("two and more cell ships should occupy cells accordingly to its length", () => {
        gameboard.placeShip(["2,3", "2,4"], new Ship(2));

        expect(gameboard.getCell(2, 3)).toBeInstanceOf(Object);
        expect(gameboard.getCell(2, 4)).toBeInstanceOf(Object);

        gameboard.placeShip(["7,2", "8,2"], new Ship(2));

        expect(gameboard.getCell(7, 2)).toBeInstanceOf(Object);
        expect(gameboard.getCell(8, 2)).toBeInstanceOf(Object);
    });

    test("placed ship should be surround by blocked cells", () => {
        gameboard.placeShip(["0,0"], new Ship(1));

        expect(gameboard.getCell(0, 1)).toBe("X");
        expect(gameboard.getCell(1, 0)).toBe("X");
        expect(gameboard.getCell(1, 1)).toBe("X");

        gameboard.receiveAttack("0,0");

        expect(gameboard.getCell(0, 1)).toBe("X");
        expect(gameboard.getCell(1, 0)).toBe("X");
        expect(gameboard.getCell(1, 1)).toBe("X");
    });
});

describe("isAllShipsSunk function", () => {
    test("checking if all ships sunk", () => {
        expect(gameboard.isAllShipsSunk()).toBe(true);

        gameboard.placeShip(["2,3", "2,4", "2,5"], new Ship(3));

        expect(gameboard.isAllShipsSunk()).toBe(false);

        gameboard.receiveAttack("2,3");
        gameboard.receiveAttack("2,4");
        gameboard.receiveAttack("2,5");

        expect(gameboard.isAllShipsSunk()).toBe(true);
    });
});
