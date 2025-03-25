import Player from "../../../src/components/Player/Player";
import Battleship from "../../../src/components/Battleship/ActivePhase";
import Gameboard from "../../../src/components/Gameboard/Gameboard";
import ShipRandomizer from "../../../src/components/Randomizer/ShipRandomizer";

let game;

beforeEach(() => {
    game = new Battleship(
        new Player("p1", new Gameboard(10, 10), new ShipRandomizer(10, 10), [["4", 1]]),
        new Player("p2", new Gameboard(10, 10), new ShipRandomizer(10, 10), [["4", 1]]),
    );
});

describe("initial statuses and players should be set", () => {
    test("starting game should apply statuses on players", () => {
        expect(game.activePlayer).toBeDefined();
        expect(game.inactivePlayer).toBeDefined();
    });

    test("initiated game statuses should be set to false", () => {
        expect(game.isEnded).toBeFalsy();
        expect(game.isStarted).toBeFalsy();
    });
});

describe("game flow test", () => {
    test("trying to attack cell if game is not started will return false", () => {
        expect(game.playRound(["2,3"])).toBeFalsy();
    });

    test("players should switch turns when active player placed all his ships and pressed confirm", () => {
        const activePlayerName = game.activePlayer.name;
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        expect(game.activePlayer.name).not.toBe(activePlayerName);
    });

    test("players turn should continue after hit and be switched after miss", () => {
        // Basically, both players set ships to the same location to make sure we know where to hit or miss
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        const activePlayerName = game.activePlayer.name;
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();

        // Hit
        game.playRound("0,3");
        expect(game.activePlayer.name).toBe(activePlayerName);

        // Miss
        game.playRound("0,4");
        expect(game.activePlayer.name).not.toBe(activePlayerName);
    });

    test("if player attacks the same cell his move does not count", () => {
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        const activePlayerName = game.activePlayer.name;

        game.playRound("0,3");
        game.playRound("0,3");
        expect(game.activePlayer.name).toBe(activePlayerName);
    });
    
    test.skip("if all fleet of one player will be destroyed, game will end", () => {
        // Create new class Settings and pass ships quantity to game? Then I can test it
    });
    test.skip("trying to attack cell if game has ended will return", () => {});
});
