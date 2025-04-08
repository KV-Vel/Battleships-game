export default class Ship {
    static shipsCreated = 0;

    #hitTimes = 0;

    #sunk = false;

    constructor(length) {
        this.length = Number(length);
        this.identificator = Ship.shipsCreated.toString();

        Ship.shipsCreated += 1;
    }

    get hitTimes() {
        return this.#hitTimes;
    }

    hit() {
        this.#hitTimes += 1;
        this.isSunk();
    }

    isSunk() {
        if (this.#hitTimes === this.length) {
            this.#sunk = true;
        }
        return this.#sunk;
    }
}
