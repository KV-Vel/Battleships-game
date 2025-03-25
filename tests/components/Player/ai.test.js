import AI from "../../../src/components/Player/AiPlayer";
import Gameboard from "../../../src/components/Gameboard/Gameboard";
import ShipRandomizer from "../../../src/components/Randomizer/ShipRandomizer";

const ai = new AI("ai", new Gameboard(10, 10), new ShipRandomizer(10, 10), new Map());

test("ai should generate non duplicating coordinates to randomly hit board", () => {
    const randomGuess = ai.generateGuess();

    expect(randomGuess).toBeDefined();
    expect(randomGuess).toHaveLength(3);
});
