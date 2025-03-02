import "./styles/reset-css.css";
import "./styles/styles.css";
import ShipRandomizer from "./components/Randomizer/ShipRandomizer";
import Player from "./components/Player/Player";
import Gameboard from "./components/Gameboard/Gameboard";
import Ship from "./components/Ship/Ship";
import Battleship from "./components/Battleship/Battleship";
import BoardUI from "./components/UI/BoardUI";

const ROWS = 10;
const COLS = 10;

const randomizer = new ShipRandomizer(ROWS, COLS);

const gameboard1 = new Gameboard(ROWS, COLS, randomizer);
const gameboard2 = new Gameboard(ROWS, COLS, randomizer);

const player1 = new Player("human", gameboard1);
const player2 = new Player("human", gameboard2);

const game = new Battleship(player1, player2);

const boardUI = new BoardUI();
const board1 = boardUI.createBoard(player1.gameboard.gameboard);
const board2 = boardUI.createBoard(player2.gameboard.gameboard);
const domPlayField = document.querySelector(".play-field");
domPlayField.append(board1);
domPlayField.append(board2);

game.canStartGame();
// tEST
// const entries = Object.entries(game.player1.shipsQuantity);
// for (let i = 4; i >= 1; i--) {
//     game.player1.gameboard.placeShipRandomly(new Ship(i));
//     console.log(game.player1);
// }

// eslint to everyfile
