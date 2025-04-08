import "./styles/reset-css.css";
import "./styles/styles.css";
import Settings from "./components/Battleship/Settings";
import ShipRandomizer from "./components/Randomizer/ShipRandomizer";
import Player from "./components/Player/Player";
import AI from "./components/Player/AiPlayer";
import Gameboard from "./components/Gameboard/gameboard";
import Battleship from "./components/Battleship/ActivePhase";
import BoardUI from "./components/UI/BoardUI";
import EventListenerManager from "./components/Controller/EventListenerManager";
import AIbrains from "./components/Player/AIbrains";
import pubsub from "./utils/PubSub";

const ROWS = 10;
const COLS = 10;

const settings = new Settings([
    ["4", 1],
    ["3", 2],
    ["2", 3],
    ["1", 4],
]);

// const settings = new Settings([
//     ["4", 6],
// ]);

const gameboard1 = new Gameboard(ROWS, COLS);
const gameboard2 = new Gameboard(ROWS, COLS);
const randomizer = new ShipRandomizer(10, 10);

const dialog = document.querySelector("dialog");
const dialogBtns = document.querySelector(".mode_btn");

window.addEventListener("DOMContentLoaded", () => {
    dialog.show();
});

dialog.addEventListener("click", e => {
    const { target } = e;

    if (target.matches(".mode_btn")) {
        // const settings = createSettings
        // create 2 players or ai and player
        // create new Battleship
        // create ui
        // ui.drawShips
        //PUBSUB
        const player1 = new Player("p1", gameboard1, randomizer, settings.shipsQuantity);
        const brains = new AIbrains();
        const ai = new AI("ai", gameboard2, randomizer, settings.shipsQuantity, brains);
        const game = new Battleship(player1, ai);

        const domPlayField = document.querySelector(".play-field");
        const ui = new BoardUI(domPlayField);
        ui.drawShips(settings.shipsQuantity);
        ui.createBoardBtns();

        pubsub.subscribe("addShip", ui.displayShip.bind(ui));
        pubsub.subscribe("attack", ui.displayAttackResult.bind(ui));
        // pubsub.subscribe("shipSunk", ui.displaySurroundingShipCells.bind(ui));
        pubsub.subscribe("isReady", ui.toggleReadyBtn.bind(ui));

        ui.createBoard(ROWS, COLS, player1.name);
        ui.createBoard(ROWS, COLS, ai.name);
        const eventListenerManager = new EventListenerManager(game, ui);
        dialog.close();
    }
});

// @todo block random ship if game started
// @todo unused function in gameboard (clearBoard());
// @todo remove addShipsRandomly() in AI constructor?
// @todo add delay before ai makes move;
// @todo surround placed ships
// @todo make randomBtn to recreate random placement repetitively and resetBoard during this
// @todo show only active player ships when 2 players and show player ships everytime when against AI
// @todo Complete drag n drop for verticall ships. Do it after completing UI. Add data-attribute to draggable ships with its alignment (horiz or vertical);
// @todo Draw x y axis on the board with. Cell coordinates B2 A5
// @todo Добавить классы создания кнопок в объект в boardUI, чтобы потом их оттуда вытаскивать из eventListenerManager.
// @todo Переназвать eVENT LISTENER Manager на GameDisplayManager
// @todo Поубирать esling ignore и запихнуть их в конфиг
// @todo Проверить переменные и оптяь поменять
// @todo у drag n drop кораблей поменять gap и взять в учет border чтобы совпадало с клетками по размеру
// @todo add static methods 
// @todo Везде перепутаны координаты, где деструктурирующее присваивание [x, y] - у меня первым идет верткальное значение а не горизонатльное. Надо поменять
// @todo Привести css классы к методологии БЭМ