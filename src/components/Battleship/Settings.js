export default class Settings {
    constructor(shipsQuantity, passDevice) {
        this.shipsQuantity = shipsQuantity;
        /** e.g. */
        // this.shipsQuantity = [
        //     ["4", 1],
        //     ["3", 2],
        //     ["2", 3],
        //     ["1", 4],
        // ];
        this.passDevice = passDevice;
        // this.aiLevel = dumb OR smart ?
    }
}
