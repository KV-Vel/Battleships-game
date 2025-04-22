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
    test("trying to attack cell if game is not started will return false", async () => {
        const attackResult = await game.playRound(["2,3"]);
        expect(attackResult).toBeFalsy();
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

    test("if all fleet of one player will be destroyed, game will end", () => {
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();

        game.playRound("0,0");
        game.playRound("0,1");
        game.playRound("0,2");
        game.playRound("0,3");

        expect(game.isGameEnded).toBeTruthy();
    });

    test("trying to attack cell if game has ended will return false", async () => {
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();

        await game.playRound("0,0");
        await game.playRound("0,1");
        await game.playRound("0,2");
        await game.playRound("0,3");

        expect(await game.playRound("0,4")).toBeFalsy();
    });

    test("reseting game should set game statuses to false", () => {
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();
        game.activePlayer.addShipToBoard(["0,0", "0,1", "0,2", "0,3"], 4);
        game.checkToStartGame();

        expect(game.isGameStarted).toBeTruthy();

        game.reset();

        expect(game.isGameStarted).toBeFalsy();
    });
});
