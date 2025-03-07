export default class Ship {
    #hitTimes = 0;

    #sunk = false;

    constructor(length) {
        this.length = Number(length);
        this.identificator = new Date().getTime().toString();
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
