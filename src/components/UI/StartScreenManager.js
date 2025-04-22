import Gameboard from "../Gameboard/gameboard";
import ShipRandomizer from "../Randomizer/ShipRandomizer";
import Player from "../Player/Player";
import AI from "../Player/AiPlayer";
import AiBrains from "../Player/AiBrains";
import PassDevice from "./passDevice";
import Battleship from "../Battleship/ActivePhase";
import BoardUI from "./BoardUI";
import GameDisplayManager from "../Controller/GameDisplayManager";

export default class StartScreenManager {
    static #toggleCircle(e) {
        const { target } = e;
        const toggleValueState = target.getAttribute("data-value");
        toggleValueState === "off" ? target.setAttribute("data-value", "on") : target.setAttribute("data-value", "off");
        target.classList.toggle("on");
    }

    static #changeShipQuantity(e) {
        const { target } = e;

        if (target.matches(".slider")) {
            const parentDiv = target.closest(".slider-mini-group");
            const sliderOutput = parentDiv.querySelector("output");

            sliderOutput.textContent = target.value;
        }
    }

    static #initGame(e, dialogSelectedData) {
        const { target } = e;
        const ROWS = 10;
        const COLS = 10;

        let passDevice;
        let aiBrains;
        let mode;

        if (dialogSelectedData.aiBrains === "on") {
            aiBrains = new AiBrains();
        }

        const gameboard1 = new Gameboard(ROWS, COLS);
        const gameboard2 = new Gameboard(ROWS, COLS);
        const randomizer = new ShipRandomizer(ROWS, COLS);
        const player1 = new Player("P1", gameboard1, randomizer, dialogSelectedData.shipsQuantity);
        let player2;

        if (target.matches(".mode_btn")) {
            mode = target.getAttribute("data-mode");

            if (mode === "pvp") {
                player2 = new Player("P2", gameboard2, randomizer, dialogSelectedData.shipsQuantity);
                passDevice = new PassDevice();
            } else {
                player2 = new AI("AI", gameboard2, randomizer, dialogSelectedData.shipsQuantity, aiBrains);
            }
        }
        if (player2.type === "AI") passDevice = null; // ??? IF I have mode
        const game = new Battleship(player1, player2, mode);

        const domPlayField = document.querySelector(".play-field");
        const boardUI = new BoardUI(domPlayField);

        boardUI.displayUI({
            firstPlayerName: player1.name,
            secondPlayerName: player2.name,
            shipsQuantity: dialogSelectedData.shipsQuantity,
        });

        if (passDevice) {
            passDevice.init();
        }

        const controller = new GameDisplayManager(game, boardUI);
        controller.init();
    }

    static #getDialogSelectedData() {
        const [fourCell, threeCell, twoCell, oneCell] = document.querySelectorAll("output");
        const aiBrains = document.querySelector(".circle");

        return {
            shipsQuantity: [
                ["4", Number(fourCell.value)],
                ["3", Number(threeCell.value)],
                ["2", Number(twoCell.value)],
                ["1", Number(oneCell.value)],
            ],
            aiBrains: aiBrains.getAttribute("data-value"),
        };
    }

    static initListeners() {
        const selectors = {
            dialog: document.querySelector("dialog"),
            circle: document.querySelector(".circle"),
            rangeElements: document.querySelectorAll("input[type='range']"),
            slidersGroup: document.querySelector(".sliders-group"),
            modeSelectionEl: document.querySelector(".mode-selection__btn-group"),
        };

        selectors.circle.addEventListener("click", e => StartScreenManager.#toggleCircle(e));
        selectors.slidersGroup.addEventListener("input", e => StartScreenManager.#changeShipQuantity(e));
        window.addEventListener("DOMContentLoaded", () => selectors.dialog.show());
        selectors.modeSelectionEl.addEventListener("click", e => {
            if (e.target.matches(".mode_btn")) {
                StartScreenManager.#initGame(e, StartScreenManager.#getDialogSelectedData());
                selectors.dialog.close();
            }
        });
    }
}
