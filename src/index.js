import "./styles/reset-css.css";
import "./styles/styles.css";
import ShipRandomizer from "./components/Randomizer/ShipRandomizer";
import Player from "./components/Player/Player";
import Gameboard from "./components/Gameboard/Gameboard";
import Battleship from "./components/Battleship/Battleship";
import BoardUI from "./components/UI/BoardUI";
import EventListenerManager from "./components/Controller/EventListenerManager";

import pubsub from "./utils/PubSub";

const ROWS = 10;
const COLS = 10;

const randomizer = new ShipRandomizer(ROWS, COLS);

const gameboard1 = new Gameboard(ROWS, COLS);
const gameboard2 = new Gameboard(ROWS, COLS);

const player1 = new Player("p1", gameboard1);
const player2 = new Player("p2", gameboard2);

const game = new Battleship(player1, player2, randomizer);

const domPlayField = document.querySelector(".play-field");
const ui = new BoardUI(domPlayField);

pubsub.subscribe("randomlyAdd", ui.displayShip.bind(ui));
pubsub.subscribe("attack", ui.displayAttackResult.bind(ui));

ui.createBoard(ROWS, COLS, player1.name);
ui.createBoard(ROWS, COLS, player2.name);
const eventListenerManager = new EventListenerManager(game, ui);
