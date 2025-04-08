export default class PassDevice {
    #stash = {
        blockedCells: [],
        shipCells: [],
    };

    #hideCells(inactivePlayerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${inactivePlayerName}]`);
        const shipCells = playersBoard.querySelectorAll(".ship-placed");
        const blockedCells = playersBoard.querySelectorAll(".blocked");

        shipCells.forEach(cell => {
            this.#stash.shipCells.push(cell.dataset.coordinate);
            cell.classList.remove("ship-placed");
        });
        blockedCells.forEach(cell => {
            this.#stash.blockedCells.push(cell.dataset.coordinate);
            cell.classList.remove("blocked");
        });
    }

    #revealCells(activePlayerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${activePlayerName}]`);

        this.#stash.shipCells.forEach(stashedCell => {
            const shipCell = playersBoard.querySelector(`[data-coordinate = '${stashedCell}']`);
            shipCell.classList.add("ship-placed");
        });

        this.#stash.blockedCells.forEach(stashBlockedCell => {
            const blockedCell = playersBoard.querySelector(`[data-coordinate = '${stashBlockedCell}']`);
            blockedCell.classList.add("blocked");
        });
    }

    activatePassDevice(activePlayerName, inactivePlayerName) {
        if (this.#stash.blockedCells.length && this.#stash.shipCells.length) {
            this.#revealCells(activePlayerName);
        }

        this.#stash = {
            blockedCells: [],
            shipCells: [],
        };

        this.#hideCells(inactivePlayerName);
        console.log(this.#stash);
    }
}
