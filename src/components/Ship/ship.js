export default class Ship {
    #hitTimes = 0;
    #sunk = false;

    constructor(length) {
        this.length = length;
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
