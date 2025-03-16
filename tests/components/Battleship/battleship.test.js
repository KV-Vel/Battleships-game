import Player from "../../../src/components/Player/Player";
import Battleship from "../../../src/components/Battleship/Battleship";
import Gameboard from "../../../src/components/Gameboard/Gameboard";
import ShipRandomizer from "../../../src/components/Randomizer/ShipRandomizer";

let game;

beforeEach(() => {
    game = new Battleship(new Player("p1", new Gameboard(10, 10)), new Player("p2", new Gameboard(10, 10)), new ShipRandomizer(10, 10));
});

test("starting game should apply statuses on players", () => {
    expect(game.getActivePlayer()).toBeDefined();
    expect(game.getInactivePlayer()).toBeDefined();
    expect(game.isGameEnded()).toBeFalsy();
});

test.skip("decide turn should change active and inactive player", () => {
    // When will add place ship function, continue test
    expect(game.getActivePlayer().name).toBe("p1");
    game.playerPlacesShipsRandomly();
    game.playerPlacesShipsRandomly();

    game.playRound("4,5");

    expect(game.getActivePlayer().name).toBe("p2");
});

test("after placing all ships randomly, player shouldn't have ships", () => {
    const activePlayer = game.getActivePlayer();
    expect(activePlayer.isReady()).toBeFalsy();

    game.playerPlacesShipsRandomly();

    // now player is inactive
    const inactivePlayer = game.getInactivePlayer();
    expect(inactivePlayer.isReady()).toBeTruthy();
});

test.skip("if all fleet of one player will be destroyed, game will end", () => {
    // Create new class Settings and pass ships quantity to game? Then I can test it
});

test.skip("players turn should change after miss or hit", () => {
    // When will add place ship function, continue test
    game.playerPlacesShip(["2,3"], 1);
});
test.skip("players turn should continue after hit", () => {
    // When will add place ship function, continue test
});
