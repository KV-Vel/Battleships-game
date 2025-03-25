import Ship from "../../../src/components/Ship/Ship";

let ship;
beforeEach(() => {
    ship = new Ship(3);
});

test("class methods have been called", () => {
    const spyOnHit = jest.spyOn(ship, "hit");
    const spyOnisSunk = jest.spyOn(ship, "isSunk");

    ship.hit();
    ship.isSunk();

    expect(spyOnHit).toHaveBeenCalled();
    expect(spyOnisSunk).toHaveBeenCalled();
});

describe("hit function", () => {
    test("hitTimes variable updates", () => {
        const spyOnGetter = jest.spyOn(ship, "hitTimes", "get");

        ship.hit();
        ship.hit();
        ship.hitTimes;

        expect(spyOnGetter).toHaveBeenCalled();
        expect(ship.hitTimes).toEqual(2);
    });
});

describe("isSunk function", () => {
    test("isSunk returns correct value according to the times ship is been hit", () => {
        ship.hit();
        ship.hit();

        expect(ship.isSunk()).toBe(false);

        ship.hit();

        expect(ship.isSunk()).toBe(true);
    });
});
