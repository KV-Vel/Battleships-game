import pubsub from "../../utils/PubSub";

export default class PassDevice {
    #stash = {};

    #playersNames = {
        activePlayerName: null,
        inactivePlayerName: null,
    };

    init() {
        pubsub.subscribe("takeTurn", this.activatePassDevice.bind(this));
        pubsub.subscribe("takeTurn", this.#updatePlayersStatuses.bind(this));
        // pubsub.subscribe("endGame", this.#reset.bind(this));
        pubsub.subscribe("reset", this.#reset.bind(this));

        this.#createDialog();
    }

    activatePassDevice([activePlayerName, inactivePlayerName, isGameStarted]) {
        if (!isGameStarted) {
            this.#blurBoard(inactivePlayerName);
            this.#unBlurBoard(activePlayerName);
        } else {
            this.#blurBoard(inactivePlayerName);
            this.#blurBoard(activePlayerName);
            this.#updateTextInMessageBox(activePlayerName);
            this.#toggleDialog();
        }

        this.#stash[inactivePlayerName] = {
            blockedCells: [],
            shipCells: [],
        };

        this.#hideCells(inactivePlayerName);
    }

    #createDialog() {
        const passDeviceDialog = document.createElement("dialog");
        passDeviceDialog.className = "pass-device-dialog";

        const wrapper = document.createElement("div");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "continue-btn";
        btn.textContent = "Continue";

        btn.addEventListener("click", () => {
            this.#revealCells(this.#playersNames.activePlayerName);
            this.#unBlurBoard(this.#playersNames.activePlayerName);
            this.#unBlurBoard(this.#playersNames.inactivePlayerName);
            this.#updateTextInMessageBox();
            this.#toggleDialog();
        });

        const messageDiv = document.createElement("div");
        messageDiv.className = "message-box";

        wrapper.append(messageDiv, btn);
        passDeviceDialog.append(wrapper);

        const controlGroup = document.querySelector(".control-group");
        controlGroup.append(passDeviceDialog);
    }

    #toggleDialog() {
        const dialog = document.querySelector(".pass-device-dialog");
        dialog.toggleAttribute("open");
    }

    #hideCells(inactivePlayerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${inactivePlayerName}]`);
        const shipCellsOfPlayerBoard = playersBoard.querySelectorAll(".ship-placed");
        const blockedCellsOfPlayerBoard = playersBoard.querySelectorAll(".blocked");

        if (!this.#stash[inactivePlayerName]) {
            this.#stash[inactivePlayerName] = {
                shipCells: null,
                blockedCells: null,
            };
        }

        shipCellsOfPlayerBoard.forEach(cell => {
            this.#stash[inactivePlayerName].shipCells.push(cell.dataset.coordinate);
            cell.classList.remove("ship-placed");
        });
        blockedCellsOfPlayerBoard.forEach(cell => {
            this.#stash[inactivePlayerName].blockedCells.push(cell.dataset.coordinate);
            // cell.classList.remove("blocked");
        });
    }

    #revealCells(activePlayerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${activePlayerName}]`);

        this.#stash[activePlayerName].shipCells.forEach(stashedCell => {
            const shipCell = playersBoard.querySelector(`[data-coordinate = '${stashedCell}']`);
            shipCell.classList.add("ship-placed");
        });
    }

    #blurBoard(inactivePlayerName) {
        const inactivePlayerBoard = document.querySelector(`[data-belonging = '${inactivePlayerName}']`);
        inactivePlayerBoard.classList.add("blur");
    }

    #unBlurBoard(activePlayerName) {
        const inactivePlayerBoard = document.querySelector(`[data-belonging = '${activePlayerName}']`);
        inactivePlayerBoard.classList.remove("blur");
    }

    #updatePlayersStatuses([activePlayerName, inactivePlayerName]) {
        this.#playersNames = {
            activePlayerName: activePlayerName,
            inactivePlayerName: inactivePlayerName,
        };
    }

    #updateTextInMessageBox(playerName) {
        const messageBox = document.querySelector(".message-box");

        if (!playerName) {
            messageBox.textContent = "";
            return;
        }

        messageBox.textContent = `Pass device to ${playerName} and click "Continue"`;
    }

    #reset() {
        this.#stash = {};
    }
}
