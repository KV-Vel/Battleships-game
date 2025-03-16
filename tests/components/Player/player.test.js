import Player from "../../../src/components/Player/Player";
import Gameboard from "../../../src/components/Gameboard/gameboard";

const player = new Player("p1", new Gameboard(10, 10));

test("player should be READY when all ships are placed", () => {
    const shipsQuantitySettings = new Map([[1, 1]]);
    player.setShipsQuantity(shipsQuantitySettings);

    expect(player.getReadyStatus()).toBeFalsy();
    player.addShip(["1,1"], 1);
    expect(player.getReadyStatus()).toBeTruthy();
});

test.skip("ships quantity should be Map object", () => {
    // const shipsQuantitySettings = new Map([[1, 1]]);
    // player.setShipsQuantity(shipsQuantitySettings);
});
