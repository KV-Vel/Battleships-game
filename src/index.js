import "./styles/reset-css.css";
import "./styles/styles.css";
import Settings from "./components/Battleship/Settings";
import ShipRandomizer from "./components/Randomizer/ShipRandomizer";
import Player from "./components/Player/Player";
import AI from "./components/Player/AiPlayer";
import Gameboard from "./components/Gameboard/Gameboard";
import Battleship from "./components/Battleship/ActivePhase";
import BoardUI from "./components/UI/BoardUI";
import EventListenerManager from "./components/Controller/EventListenerManager";

import pubsub from "./utils/PubSub";

const ROWS = 10;
const COLS = 10;

// const settings = new Settings([
//     ["4", 1],
//     ["3", 2],
//     ["2", 3],
//     ["1", 4],
// ]);

const settings = new Settings([
    ["4", 1],
    ["3", 2],
    ["2", 3],
    ["1", 4],
]);

const gameboard1 = new Gameboard(ROWS, COLS);
const gameboard2 = new Gameboard(ROWS, COLS);

const randomizer = new ShipRandomizer(10, 10);

const player1 = new Player("p1", gameboard1, randomizer, settings.shipsQuantity);
const ai = new Player("ai", gameboard2, randomizer, settings.shipsQuantity);

const prepphase = new Battleship(player1, ai);

const domPlayField = document.querySelector(".play-field");
const ui = new BoardUI(domPlayField);
ui.drawShips(settings.shipsQuantity);

pubsub.subscribe("addShip", ui.displayShip.bind(ui));
pubsub.subscribe("attack", ui.displayAttackResult.bind(ui));
pubsub.subscribe("isReady", ui.toggleReadyBtn.bind(ui));

ui.createBoard(ROWS, COLS, player1.name);
ui.createBoard(ROWS, COLS, ai.name);
const eventListenerManager = new EventListenerManager(prepphase, ui);

// @todo block random ship if game started
// @todo unused function in gameboard (clearBoard());
// @todo remove addShipsRandomly() in AI constructor?
// @todo add delay before ai makes move;
// @todo surround placed ships
// @todo make randomBtn to recreate random placement repetitively and resetBoard during this
// @todo prepphase not needed?? потому что смысла от нее 0, и только bothPlayersReady нужна
// @todo show only active player ships when 2 players and show player ships everytime when against AI