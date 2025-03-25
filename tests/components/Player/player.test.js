import Player from "../../../src/components/Player/Player";
import Gameboard from "../../../src/components/Gameboard/Gameboard";

let player;
let shipsQuantity;

beforeEach(() => {
    shipsQuantity = new Map([["1", 1]]);
    player = new Player("p1", new Gameboard(10, 10), {}, shipsQuantity);
});

test("player should be READY when all ships are placed", () => {
    expect(player.isReady()).toBeFalsy();
    player.addShipToBoard(["1,1"], 1);

    expect(player.isReady()).toBeTruthy();
});

describe("testing returned coordinates from added ship", () => {
    test("adding ship to board will return array of coordinates", () => {
        const shipCoordinatesToBePlaced = "1,1";
        const coords = player.addShipToBoard([shipCoordinatesToBePlaced], 1);
        expect(coords[0][0]).toContain(shipCoordinatesToBePlaced);
        expect(coords).toHaveLength(2);
    });
});

test("cant add ships randomly if randomizer wasnt provided in arguments", () => {
    const ships = new Map([["1", 1]]);
    const wronglySetUp = new Player("p1", new Gameboard(10, 10), undefined, ships);

    expect(() => {
        wronglySetUp.addShipsRandomly();
    }).toThrow();
});

test("placing ships when their number is equal to 0 should return false", () => {
    player.addShipToBoard(["1,1"], 1);
    expect(player.addShipToBoard(["5,1"], 1)).toBeFalsy();
});
