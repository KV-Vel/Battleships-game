import ShipRandomizer from "../../../src/components/Randomizer/ShipRandomizer";

let randomizer;
beforeEach(() => {
    randomizer = new ShipRandomizer(10, 10);
});

test("available ship placements should be filled with value after creating instance of ShipRandomizer", () => {
    expect(randomizer.availableShipPlacements[4].length).toBeGreaterThan(1);
    expect(randomizer.availableShipPlacements[3].length).toBeGreaterThan(1);
    expect(randomizer.availableShipPlacements[2].length).toBeGreaterThan(1);
    expect(randomizer.availableShipPlacements[1].length).toBeGreaterThan(1);
});

test("generating random coordinates function getting called and returns value", () => {
    const spyRandomizer = jest.spyOn(randomizer, "generateRandomCoordinates");
    const randomCoordinate = randomizer.generateRandomCoordinates(3);

    expect(spyRandomizer).toHaveBeenCalled();

    // returning array and coordinates length = argument of randomCoordinate variable
    expect(randomCoordinate).toBeInstanceOf(Array);
    expect(randomCoordinate).toHaveLength(3);

    jest.restoreAllMocks();
});

test("deleting coordinates should decrease number of available coordinates", () => {
    const randomCoordinate = randomizer.generateRandomCoordinates(4);
    const initialAvailableCoordinatesLength = randomizer.availableShipPlacements[4].length;

    randomizer.deleteShipPlacements(randomCoordinate);
    const updatedAvailableCoordinatesLength = randomizer.availableShipPlacements[4].length;
    expect(updatedAvailableCoordinatesLength).toBeLessThan(initialAvailableCoordinatesLength);
});

test("reset function should reset randomizer to initial state", () => {
    const randomCoordinate = randomizer.generateRandomCoordinates(4);
    randomizer.deleteShipPlacements(randomCoordinate);

    const anotherRandomCoordinates = randomizer.generateRandomCoordinates(3);
    randomizer.deleteShipPlacements(anotherRandomCoordinates);

    randomizer.resetAvailableCoordinates();
    expect(randomizer.availableShipPlacements["1"]).toHaveLength(200);

    const thirdRandomCoordinates = randomizer.generateRandomCoordinates(1);
    randomizer.deleteShipPlacements(thirdRandomCoordinates);

    randomizer.resetAvailableCoordinates();
    expect(randomizer.availableShipPlacements["1"]).toHaveLength(200);
});

test("deleting coordinates should be an array", () => {
    expect(randomizer.deleteShipPlacements("1,2")).toBeUndefined();
    expect(randomizer.deleteShipPlacements({ coordinate: ["1,2"] })).toBeUndefined();
});
