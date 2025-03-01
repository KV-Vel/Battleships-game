import "./styles/reset-css.css";
import "./styles/styles.css";
import ShipRandomizer from "./components/Randomizer/ShipRandomizer";
import Player from "./components/Player/Player";
import Gameboard from './components/Gameboard/Gameboard';
import Ship from './components/Ship/Ship';

const ROWS = 10;
const COLS = 10;

const randomizer = new ShipRandomizer(ROWS, COLS);
const gameboard1 = new Gameboard(ROWS, COLS, randomizer);
const gameboard2 = new Gameboard(ROWS, COLS, randomizer);

const player1 = new Player('human', gameboard1);
const player2 = new Player('human', gameboard2);

player1.gameboard.placeShip(['0,0', '0,1'], new Ship(2))

console.log(player1)
// eslint to everyfile