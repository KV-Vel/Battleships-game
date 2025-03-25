import Player from "../../../src/components/Player/Player";
import AbstractGamePhase from "../../../src/components/Battleship/AbstractGamePhase";

const abstractGamePhase = new AbstractGamePhase(new Player("p1"), new Player("p2"));

test("game phase should initialize active and inactive players", () => {
    expect(abstractGamePhase.activePlayer).toBeDefined();
    expect(abstractGamePhase.inactivePlayer).toBeDefined();
});
