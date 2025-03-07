import "./styles/reset-css.css";
import "./styles/styles.css";
import ShipRandomizer from "./components/Randomizer/ShipRandomizer";
import Player from "./components/Player/Player";
import Gameboard from "./components/Gameboard/gameboard";
import Battleship from "./components/Battleship/Battleship";
import BoardUI from "./components/UI/BoardUI";

const ROWS = 10;
const COLS = 10;

const randomizer = new ShipRandomizer(ROWS, COLS);


const gameboard1 = new Gameboard(ROWS, COLS, randomizer);
const gameboard2 = new Gameboard(ROWS, COLS, randomizer);

const player1 = new Player("human", gameboard1);
const player2 = new Player("human", gameboard2);

const domPlayField = document.querySelector(".play-field");
const game = new Battleship(player1, player2, new BoardUI(domPlayField));

// player1.gameboard.placeShipRandomly([
//     new Ship(4),
//     new Ship(3),
//     new Ship(3),
//     new Ship(2),
//     new Ship(2),
//     new Ship(2),
//     new Ship(1),
//     new Ship(1),
//     new Ship(1),
//     new Ship(1),
// ]);

console.log(player1.gameboard);

// game.canStartGame();
// tEST
// const entries = Object.entries(game.player1.shipsQuantity);
// for (let i = 4; i >= 1; i--) {
//     game.player1.gameboard.placeShipRandomly(new Ship(i));
//     console.log(game.player1);
// }

// eslint to everyfile
