/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/Battleship/AbstractGamePhase.js":
/*!********************************************************!*\
  !*** ./src/components/Battleship/AbstractGamePhase.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractGamePhase)
/* harmony export */ });
class AbstractGamePhase {
    players = {
        activePlayer: null,
        inactivePlayer: null,
    };

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.#initPlayers(player1, player2);
    }

    get activePlayer() {
        return this.players.activePlayer;
    }

    set activePlayer(player) {
        this.players.activePlayer = player;
    }

    get inactivePlayer() {
        return this.players.inactivePlayer;
    }

    set inactivePlayer(player) {
        this.players.inactivePlayer = player;
    }

    #initPlayers(player1, player2) {
        this.activePlayer = player1;
        this.inactivePlayer = player2;
    }
}


/***/ }),

/***/ "./src/components/Battleship/ActivePhase.js":
/*!**************************************************!*\
  !*** ./src/components/Battleship/ActivePhase.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Battleship)
/* harmony export */ });
/* harmony import */ var _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/PubSub */ "./src/utils/PubSub.js");
/* harmony import */ var _AbstractGamePhase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractGamePhase */ "./src/components/Battleship/AbstractGamePhase.js");
/* eslint-disable consistent-return */



class Battleship extends _AbstractGamePhase__WEBPACK_IMPORTED_MODULE_1__["default"] {
    #statuses = {
        isGameEnded: false,
        isGameStarted: false,
    };

    constructor(player1, player2, mode) {
        super(player1, player2);
        this.mode = mode;
    }

    async playRound(coordinates) {
        if (this.isGameEnded || !this.isGameStarted) return false;

        const attackResultData = this.activePlayer.attack(this.inactivePlayer.gameboard, coordinates);
        if (!attackResultData) return;

        const { status } = attackResultData;

        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("attack", {
            playerReceivingHitName: this.inactivePlayer.name,
            ...attackResultData,
        });

        if (this.inactivePlayer.gameboard.isAllShipsSunk()) {
            this.isGameEnded = true;
            _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("gameEnded", this.activePlayer.name);
            this.isGameStarted = false;
            return `${this.activePlayer.name} won!`;
        }

        if (status === "miss") {
            this.#switchTurn();
        }

        if (this.activePlayer.type === "AI") {
            const guess = await this.activePlayer.generateGuess();
            this.playRound(guess);
        }
    }

    checkToStartGame() {
        if (this.#isBothPlayersReady()) {
            this.isGameStarted = true;

            if (this.mode === "pvp") {
                this.#switchTurn();
            }

            return this.isGameStarted;
        }

        this.#switchTurn();
    }

    reset() {
        this.isGameEnded = false;
        this.isGameStarted = false;
        this.activePlayer = this.player1;
        this.inactivePlayer = this.player2;

        this.activePlayer.reset();
        this.inactivePlayer.reset();

        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("reset", [this.activePlayer.name, this.inactivePlayer.name, this.isGameStarted]);
    }

    get isGameStarted() {
        return this.#statuses.isGameStarted;
    }

    set isGameStarted(value) {
        if (typeof value !== "boolean") return;
        this.#statuses.isGameStarted = value;
    }

    get isGameEnded() {
        return this.#statuses.isGameEnded;
    }

    set isGameEnded(result) {
        if (typeof result !== "boolean") return;

        this.#statuses.isGameEnded = result;
    }

    #switchTurn() {
        const { inactivePlayer, activePlayer } = this;

        this.activePlayer = inactivePlayer;
        this.inactivePlayer = activePlayer;

        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("takeTurn", [this.activePlayer.name, this.inactivePlayer.name, this.isGameStarted]);
    }

    #isBothPlayersReady() {
        return this.activePlayer.isReady() && this.inactivePlayer.isReady();
    }
}


/***/ }),

/***/ "./src/components/Controller/GameDisplayManager.js":
/*!*********************************************************!*\
  !*** ./src/components/Controller/GameDisplayManager.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventListenerManager)
/* harmony export */ });
/* harmony import */ var _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/PubSub */ "./src/utils/PubSub.js");


class EventListenerManager {
    #selectors;

    constructor(game, ui) {
        this.game = game;
        this.ui = ui;

        this.#selectors = {
            randomBtn: document.querySelector(`.${this.ui.buttonSelectorsNames.randomBtn}`),
            boards: document.querySelectorAll(`.${this.ui.boardSelectorsNames.boardRoot} > .board`),
            readyBtn: document.querySelector(`.${this.ui.buttonSelectorsNames.readyBtn}`),
            shipCells: document.querySelectorAll(`.${this.ui.shipSelectorsNames.shipCell}`),
            shipEl: document.querySelectorAll(`.${this.ui.shipSelectorsNames.ship}`),
            tryAgainBtn: document.querySelector(`.${this.ui.buttonSelectorsNames.tryAgainBtn}`),
            btnGroup: document.querySelector(".btn_group"),
        };
    }

    init() {
        this.#selectors.randomBtn.addEventListener("click", () => this.onRandomShipPlacement());
        this.#selectors.readyBtn.addEventListener("click", () => this.onConfirmShipsPlacement());
        this.#selectors.shipEl.forEach(ship => ship.addEventListener("dragstart", e => this.onDragStart(e)));
        this.#selectors.btnGroup.addEventListener("click", e => this.onAxisChange(e));
        this.#selectors.tryAgainBtn.addEventListener("click", () => this.onRestart());
        this.#selectors.boards.forEach(board => {
            board.addEventListener("click", e => this.onPlayerAttack(e));
            board.addEventListener("dragover", e => e.preventDefault());
            board.addEventListener("drop", e => this.onDrop(e));
        });
        this.#selectors.shipCells.forEach(cell => {
            // Apllying class and not using :hover. It's necessary to identify child element which has been dragged
            cell.addEventListener("mouseenter", e => e.target.classList.toggle("active"));
            cell.addEventListener("mouseleave", e => e.target.classList.toggle("active"));
        });
    }

    onShipPlacement(coordinates, size) {
        if (this.game.activePlayer.type === "AI") return;

        const isPlaced = this.game.activePlayer.addShipToBoard(coordinates, size);

        if (this.game.activePlayer.isReady()) {
            this.#selectors.readyBtn.disabled = false;
        }

        return isPlaced;
    }

    onRandomShipPlacement() {
        if (this.game.activePlayer.type === "AI") return;
        this.ui.clearBoard(this.game.activePlayer.name);

        this.game.activePlayer.addShipsRandomly();

        if (this.game.activePlayer.isReady()) {
            this.#selectors.readyBtn.disabled = false;
        }
    }

    onPlayerAttack(e) {
        if (this.game.activePlayer.type === "AI") return;

        const { target } = e;

        const boardBelonging = target.closest(`.${this.ui.boardSelectorsNames.boardRoot}`).dataset.belonging;
        if (boardBelonging !== this.game.inactivePlayer.name) return;

        if (target.matches(`.${this.ui.boardSelectorsNames.boardCell}`)) {
            const clickedCellCoordinates = target.getAttribute("data-coordinate");

            this.game.playRound(clickedCellCoordinates);
        }
    }

    onConfirmShipsPlacement() {
        this.ui.hideBlockedCells(this.game.activePlayer.name);
        this.game.checkToStartGame();
        if (this.game.isGameStarted) {
            this.disableRandomBtn();
        }

        this.toggleReadyBtn();
    }

    onDragStart(e) {
        // Getting cells of dragging ship
        const [...childrens] = e.target.children;
        const findActiveCellIndex = child => child.matches(".active");
        const activeCellIndex = childrens.findIndex(findActiveCellIndex);

        // Passing activeCell
        e.dataTransfer.setData("active", activeCellIndex);
        e.dataTransfer.setData("length", e.target.dataset.length);
        e.dataTransfer.setData("axis", e.target.dataset.axis);
    }

    onDrop(e) {
        e.preventDefault();

        if (this.game.isGameStarted) return;
        // Checking if board where drop happens belong to active player
        const board = e.target.closest(`.${this.ui.boardSelectorsNames.boardRoot}`);
        if (board.dataset.belonging !== this.game.activePlayer.name) return;

        const activeCellIndex = e.dataTransfer.getData("active");
        const shipLength = e.dataTransfer.getData("length");
        const axis = e.dataTransfer.getData("axis");
        const [y, x] = e.target.dataset.coordinate.split(",");

        // Preventing offset ship placement
        if (activeCellIndex === "-1") return;

        // Searching for first coordinate where start of the ship will be, to place it with offset correctly
        const activeAxis = axis === "horizontal" ? x : y;
        const firstCoordinateOfShip = activeAxis - activeCellIndex;

        if (firstCoordinateOfShip < 0) return;

        const coordinatesToPlaceTo = [];

        for (let i = 0; i < shipLength; i += 1) {
            if (axis === "horizontal") {
                coordinatesToPlaceTo.push([y, firstCoordinateOfShip + i].join(","));
            } else {
                coordinatesToPlaceTo.push([firstCoordinateOfShip + i, x].join(","));
            }
        }
        this.onShipPlacement(coordinatesToPlaceTo, shipLength);
    }

    toggleReadyBtn() {
        const readyBtn = document.querySelector(".ready-state-btn");
        readyBtn.toggleAttribute("disabled");
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("updateShipsQuantity", this.game.activePlayer.shipsQuantity);
    }

    disableRandomBtn() {
        this.#selectors.randomBtn.disabled = true;
    }

    onAxisChange(e) {
        const shipWrapper = document.querySelector(".ship-wrapper");
        const shipQuantityDivs = document.querySelectorAll(".ship-wrapper__quantity");

        if (e.target.matches(".vertical-axis-btn")) {
            shipQuantityDivs.forEach(div => (div.style.flexDirection = "column-reverse"));

            shipWrapper.className = "ship-wrapper vertical";
            this.#selectors.shipEl.forEach(ship => {
                ship.className = "ship horizontal";
                ship.dataset.axis = "vertical";
            });
        }

        if (e.target.matches(".horizontal-axis-btn")) {
            shipQuantityDivs.forEach(div => div.style.flexDirection = "row");

            shipWrapper.className = "ship-wrapper horizontal";
            this.#selectors.shipEl.forEach(ship => {
                ship.className = "ship vertical";
                ship.dataset.axis = "horizontal";
            });
        }
    }

    onTakeTurn() {
        this.game.passDevice.activatePassDevice([this.game.activePlayer.name, this.game.inactivePlayer.name]);
    }

    onRestart() {
        this.game.reset();
        this.#selectors.randomBtn.disabled = false;
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("updateShipsQuantity", this.game.activePlayer.shipsQuantity);

        const gameResultDialog = document.querySelector(".result-dialog");
        gameResultDialog.close();
    }
}


/***/ }),

/***/ "./src/components/Gameboard/gameboard.js":
/*!***********************************************!*\
  !*** ./src/components/Gameboard/gameboard.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
class Gameboard {
    #gameboard;

    #attackedCoordinates = [];

    #ships = {
        shipsOnBoard: 0,
        // here will be placed ship identificator and it's surrounding cells
    };

    static #createBoard(rows, cols) {
        return [...Array(rows)].map(() => Array(cols).fill("?"));
    }

    static #isInputValid(coordinates) {
        const coordinatesRegExp = /\d+,\d+/gm;
        return typeof coordinates === "string" && coordinatesRegExp.test(coordinates);
    }

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.#gameboard = Gameboard.#createBoard(this.rows, this.cols);
    }

    placeShip(coordinates, ship) {
        if (coordinates.length !== ship.length) return false;
        if (!this.#isCoordinatesOverflow(coordinates)) return false;
        if (!this.#isCoordinatesFree(coordinates)) return false;

        coordinates.forEach(coordinate => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            this.#gameboard[x][y] = ship;
        });

        this.#ships.shipsOnBoard += 1;

        const blockedCells = this.#surroundShipWithBlockedCells(coordinates);
        // Will be used to surround ship when it is destroyed or placed
        this.#ships[ship.identificator] = {
            blockedCells,
            shipCoordinates: coordinates,
        };

        return [coordinates, blockedCells];
    }

    receiveAttack(coordinates) {
        if (!Gameboard.#isInputValid(coordinates)) return;
        const [x, y] = coordinates.split(",");

        if (!this.#isCellValid(x, y)) return;
        if (this.#attackedCoordinates.includes(coordinates)) return;

        const cell = this.getCell(x, y);
        this.#attackedCoordinates.push(coordinates);

        if (!["?", "X"].includes(cell)) {
            // If we hit then this cell is a ship
            const ship = cell;
            ship.hit();

            if (ship.isSunk()) {
                this.#ships.shipsOnBoard -= 1;
                this.#gameboard[x][y] = "X";

                // If ship is sunk, surrounding it with blockedCells, player can't attack those cells anymore
                const shipBlockingCells = this.#ships[ship.identificator].blockedCells;
                this.#attackedCoordinates.push(...shipBlockingCells);

                return { status: "sunk", blockedCells: shipBlockingCells };
            }
            // after hitting not hitting, cell becomes unavailable
            this.#gameboard[x][y] = "X";
            return { status: "hit", blockedCells: null };
        }

        return { status: "miss", blockedCells: null };
    }

    isAllShipsSunk() {
        return this.#ships.shipsOnBoard === 0;
    }

    getCell(x, y) {
        if (!this.#isCellValid(x, y)) return null;

        return this.#gameboard[x][y];
    }

    clearBoard() {
        this.#gameboard = Gameboard.#createBoard(this.rows, this.cols);
        this.#attackedCoordinates = [];
        this.#ships = {
            shipsOnBoard: 0,
        };
    }

    get myBattleField() {
        return this.#gameboard;
    }

    get quantityOfShips() {
        return this.#ships.shipsOnBoard;
    }

    #getSurroundingShipCells(coordinates) {
        const SHIP_MOVES_OFFSETS = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        const allPossibleCoordinates = SHIP_MOVES_OFFSETS.reduce((acc, [x, y]) => {
            coordinates.forEach(coordinate => {
                const separatedCoordinates = coordinate.split(",");
                let [newX, newY] = separatedCoordinates;

                // Converting string input to number
                newX = Number(newX);
                newY = Number(newY);

                // Filtering only valid surrounding coordinates. e.g ship placed in the corner with negative values close
                if (!this.#isCellValid(x + newX, y + newY)) return;
                if (!["X", "?"].includes(this.getCell(x + newX, y + newY))) return;

                acc.push([x + newX, y + newY].toString());
            });

            return acc;
        }, []);

        // Removing duplicated coordinates
        const set = new Set(allPossibleCoordinates);

        return [...set];
    }

    #surroundShipWithBlockedCells(shipCoordinates) {
        const cellsSurroundingShip = this.#getSurroundingShipCells(shipCoordinates);
        return cellsSurroundingShip.reduce((acc, str) => {
            // converting to array. After being stored in Set
            const separatedNums = str.split(",");
            const [x, y] = separatedNums;

            this.#gameboard[x][y] = "X";

            return [...acc, str];
        }, []);
    }

    #isCoordinatesFree(inputedCoordinates) {
        const freeCoordinates = inputedCoordinates.filter(coordinate => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            const cell = this.getCell(x, y);
            return cell === "?" && cell !== "X";
        });
        return freeCoordinates.length === inputedCoordinates.length;
    }

    #isCoordinatesOverflow(inputedCoordinates) {
        const validCoordinates = inputedCoordinates.filter(coordinate => {
            const separatedNums = coordinate.split(",");
            const [x, y] = separatedNums;

            return this.#isCellValid(x, y);
        });

        return validCoordinates.length === inputedCoordinates.length;
    }

    #isCellValid(x, y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }
}


/***/ }),

/***/ "./src/components/Player/AiBrains.js":
/*!*******************************************!*\
  !*** ./src/components/Player/AiBrains.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AiBrains)
/* harmony export */ });
/* harmony import */ var _utils_randomNum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/randomNum */ "./src/utils/randomNum.js");


class AiBrains {
    static #findDirection(firstCoords, lastCoords) {
        // Destructuring only first part of coordinate => "2,3" => getting only 2
        const [firstXCoords] = firstCoords.split(",");
        const [lastXCoords] = lastCoords.split(",");
        // If first number of coordinates is different that it is vertical, otherwise horizontal
        return firstXCoords === lastXCoords ? "horizontal" : "vertical";
    }

    #brainState = {
        firstHit: null,
        lastHit: null,
        attackDirection: null,
    };

    handleAttackResult(enemyBoard, attackingCoords, possibleGuesses, hitResultStatus) {
        if (hitResultStatus === "sunk") this.resetPossibleSmartGuesses();
        if (hitResultStatus === "hit") this.#generatePossibleSmartGuesses(enemyBoard, attackingCoords, possibleGuesses);
    }

    makeSmartMove() {
        let guess;
        let randomAxis;

        // Grabbing last hit if it's defined and has vertical and horizontal coordinates to attack
        if (this.#brainState.lastHit && (this.#brainState.lastHit.horizontal.length || this.#brainState.lastHit.vertical.length)) {
            const { attackDirection } = this.#brainState;
            randomAxis = this.#brainState.lastHit[attackDirection];

            // By this time last hit will have only one direction and one coordinate
            guess = randomAxis[0];

            this.#brainState.lastHit[attackDirection] = [];
            return guess.join(",");
        }

        // If we don't have lastHit then we random possible cell where ship might be
        randomAxis = this.#getRandomAxis(this.#brainState.firstHit);
        const randomAxisCoordIndex = (0,_utils_randomNum__WEBPACK_IMPORTED_MODULE_0__["default"])(0, this.#brainState.firstHit[randomAxis].length);

        guess = this.#brainState.firstHit[randomAxis][randomAxisCoordIndex];
        const reducedGuesses = this.#brainState.firstHit[randomAxis].filter(coords => coords !== guess);
        this.#brainState.firstHit[randomAxis] = reducedGuesses;

        return guess.join(",");
    }

    resetPossibleSmartGuesses() {
        this.#brainState = {
            firstHit: null,
            lastHit: null,
            attackDirection: null,
        };
    }

    #generatePossibleSmartGuesses(enemyGameboard, coords, aiGuesses) {
        if (!this.#brainState.firstHit) {
            this.#brainState.firstHit = this.#setBrainStateHit(coords, enemyGameboard, aiGuesses);
        } else {
            this.#brainState.lastHit = this.#setBrainStateHit(coords, enemyGameboard, aiGuesses);

            const foundAttackDirection = AiBrains.#findDirection(
                this.#brainState.firstHit.initialHitCoords,
                this.#brainState.lastHit.initialHitCoords,
            );

            this.#brainState.attackDirection = foundAttackDirection;
            const directionToDelete = foundAttackDirection === "horizontal" ? "vertical" : "horizontal";

            this.#brainState.firstHit[directionToDelete] = [];
            this.#brainState.lastHit[directionToDelete] = [];
        }
    }

    get firstHit() {
        return this.#brainState.firstHit;
    }

    get lastHit() {
        return this.#brainState.lastHit;
    }

    #setBrainStateHit(initialHitCoords, enemyGameboard, aiGuesses) {
        const [y, x] = initialHitCoords.split(",");
        const numberX = Number(x);
        const numberY = Number(y);

        // Defining next possible smart moves coordinates
        const [right, left, top, bottom] = [
            [numberY, numberX + 1],
            [numberY, numberX - 1],
            [numberY + 1, numberX],
            [numberY - 1, numberX],
        ];

        return {
            initialHitCoords,
            horizontal: [right, left].filter(
                ([xCoords, yCoords]) => enemyGameboard.getCell(xCoords, yCoords) && !!aiGuesses.includes([xCoords, yCoords].join(",")),
            ),
            vertical: [top, bottom].filter(
                ([xCoords, yCoords]) => enemyGameboard.getCell(xCoords, yCoords) && !!aiGuesses.includes([xCoords, yCoords].join(",")),
            ),
        };
    }

    #getRandomAxis(hitObject) {
        const randomNumber = (0,_utils_randomNum__WEBPACK_IMPORTED_MODULE_0__["default"])(0, 2);
        let randomAxis = randomNumber === 1 ? "vertical" : "horizontal";

        // If randomAxis is empty, we get another axis that should be filled with value
        if (!hitObject[randomAxis] || !hitObject[randomAxis].length) {
            randomAxis = randomAxis === "vertical" ? "horizontal" : "vertical";
        }

        return randomAxis;
    }
}


/***/ }),

/***/ "./src/components/Player/AiPlayer.js":
/*!*******************************************!*\
  !*** ./src/components/Player/AiPlayer.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AI)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/components/Player/Player.js");
/* harmony import */ var _utils_randomNum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/randomNum */ "./src/utils/randomNum.js");



class AI extends _Player__WEBPACK_IMPORTED_MODULE_0__["default"] {
    #guesses;

    constructor(name, gameboard, randomizer, shipsQuantity, brains) {
        super(name, gameboard, randomizer, shipsQuantity);
        this.type = "AI";
        this.brains = brains;
        this.#guesses = this.#initPossibleGuesses();
        this.addShipsRandomly();
    }

    attack(enemyGameboard, attackCoordinate) {
        const hitResult = enemyGameboard.receiveAttack(attackCoordinate);
        if (!hitResult) return false;
        let coordinatesToDelete = [attackCoordinate];

        if (hitResult.status === "sunk") {
            coordinatesToDelete = [...hitResult.blockedCells, attackCoordinate];
        }

        if (this.brains) {
            this.brains.handleAttackResult(enemyGameboard, attackCoordinate, this.#guesses, hitResult.status);
        }

        this.#deleteGuess(coordinatesToDelete);

        return {
            coordinates: attackCoordinate,
            status: hitResult.status,
            blockedCells: hitResult.blockedCells,
        };
    }

    generateGuess() {
        let guess;

        if (this.brains && this.brains.firstHit) {
            guess = this.brains.makeSmartMove();
        } else {
            const randomNumber = (0,_utils_randomNum__WEBPACK_IMPORTED_MODULE_1__["default"])(0, this.#guesses.length);
            guess = this.#guesses[randomNumber];
        }

        // Using 'third argument' to pass guess to resolve
        return new Promise(resolve => {
            setTimeout(resolve, 1200, guess);
        });
    }

    reset() {
        // Calling player reset()
        super.reset();

        if (this.brains) {
            this.brains.resetPossibleSmartGuesses();
        }
        this.#guesses = this.#initPossibleGuesses();
        this.addShipsRandomly();
    }

    #initPossibleGuesses() {
        // AI parsing gameboard cells to formulate possible guesses
        const parsedBoard = this.gameboard.myBattleField.map((row, indexX) => row.map((_, indexY) => [indexX, indexY].join()));

        return parsedBoard.flat();
    }

    #deleteGuess(guessesToDelete) {
        const filtered = this.#guesses.filter(coordinate => !guessesToDelete.includes(coordinate));
        this.#guesses = filtered;
    }
}


/***/ }),

/***/ "./src/components/Player/Player.js":
/*!*****************************************!*\
  !*** ./src/components/Player/Player.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _Ship_ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Ship/ship */ "./src/components/Ship/ship.js");
/* harmony import */ var _utils_PubSub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/PubSub */ "./src/utils/PubSub.js");



class Player {
    // takes instanceof Map object
    #shipsQuantity;

    #shipsQuantityStaticCopy;

    #statuses = {
        readyToStart: false,
    };

    constructor(name, gameboard, randomizer, shipsQuantity) {
        this.name = name;
        this.gameboard = gameboard;
        this.randomizer = randomizer;
        this.#shipsQuantity = new Map(shipsQuantity); // bound to Map
        this.#shipsQuantityStaticCopy = shipsQuantity;
        this.type = "HUMAN";
    }

    attack(enemyGameboard, coordinates) {
        const hitResult = enemyGameboard.receiveAttack(coordinates);
        if (!hitResult) return false;

        return {
            coordinates: coordinates,
            status: hitResult.status,
            blockedCells: hitResult.blockedCells,
        };
    }

    addShipToBoard(coordinates, size) {
        // Checking if player still have this ship size
        if (this.#shipsQuantity.get(size.toString()) === 0) return false;

        const placedValues = this.gameboard.placeShip(coordinates, new _Ship_ship__WEBPACK_IMPORTED_MODULE_0__["default"](size));
        if (!placedValues) return;

        const [placedShipCoordinates, blockedCoordinates] = placedValues;

        if (placedShipCoordinates) {
            _utils_PubSub__WEBPACK_IMPORTED_MODULE_1__["default"].publish("addShip", {
                placedShipCoordinates,
                blockedCoordinates,
                name: this.name,
            });
            this.#reduceShipsByOne(size);
            _utils_PubSub__WEBPACK_IMPORTED_MODULE_1__["default"].publish("updateShipsQuantity", this.shipsQuantity);
        }

        return [placedShipCoordinates, blockedCoordinates];
    }

    addShipsRandomly() {
        if (!this.randomizer) throw new Error("Can't place ship randomly if randomizer undefined");

        // Redeclaring shipsQuantity during each usage of this func
        this.#shipsQuantity = new Map(this.#shipsQuantityStaticCopy);
        this.gameboard.clearBoard();

        for (const [shipSize, numberOfShips] of this.#shipsQuantity) {
            for (let i = 0; i !== numberOfShips; i += 1) {
                const randomCoordinates = this.randomizer.generateRandomCoordinates(shipSize);
                const shipCoordinates = this.addShipToBoard(randomCoordinates, shipSize);
                this.randomizer.deleteShipPlacements(shipCoordinates);
            }
        }

        this.randomizer.resetAvailableCoordinates();
    }

    // Player will be considered "ready" if all his ships are placed
    isReady() {
        // Getting ship quantities of every ship
        const shipNumbers = [...this.#shipsQuantity.values()];
        const isEveryShipPlaced = shipNumbers.every(ship => ship === 0);

        if (isEveryShipPlaced) this.#statuses.readyToStart = true;

        return this.#statuses.readyToStart;
    }

    reset() {
        this.gameboard.clearBoard();
        this.#shipsQuantity = new Map(this.#shipsQuantityStaticCopy);
        this.#statuses.readyToStart = false;
    }

    get shipsQuantity() {
        return this.#shipsQuantity;
    }

    #reduceShipsByOne(size) {
        const strSize = size.toString();
        if (!strSize) return "Can't convert to str";

        const previousValue = this.#shipsQuantity.get(strSize);
        this.#shipsQuantity.set(strSize, previousValue - 1);
    }
}


/***/ }),

/***/ "./src/components/Randomizer/ShipRandomizer.js":
/*!*****************************************************!*\
  !*** ./src/components/Randomizer/ShipRandomizer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShipRandomizer)
/* harmony export */ });
/* harmony import */ var _utils_randomNum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/randomNum */ "./src/utils/randomNum.js");


class ShipRandomizer {
    static #traverseAllPossibleCoordinates(x, y) {
        const rowsTwo = [
            [x, y],
            [x, y + 1],
        ];
        const rowsThree = [...rowsTwo, [x, y + 2]];
        const rowsFour = [...rowsThree, [x, y + 3]];

        const colsTwo = [
            [x, y],
            [x + 1, y],
        ];
        const colsThree = [...colsTwo, [x + 2, y]];
        const colsFour = [...colsThree, [x + 3, y]];

        return {
            rows: [[[x, y]], rowsTwo, rowsThree, rowsFour],
            cols: [[[x, y]], colsTwo, colsThree, colsFour],
        };
    }

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.availableShipPlacements = this.#fillRandomShipPlacements(this.cols, this.rows);

        // Copy needed to reset availableShipPlacements to default values, to not make another calculations;
        this.copy = JSON.parse(JSON.stringify(this.availableShipPlacements));
    }

    generateRandomCoordinates(shipSize) {
        // getting array of available coordinates for inputed shipSize
        const shipAvailableCoordinates = this.availableShipPlacements[shipSize];
        const maxNumToRandomize = shipAvailableCoordinates.length;
        const randomNum = (0,_utils_randomNum__WEBPACK_IMPORTED_MODULE_0__["default"])(0, maxNumToRandomize);

        return shipAvailableCoordinates[randomNum];
    }

    deleteShipPlacements(deletingCoordinates) {
        if (!(deletingCoordinates instanceof Array)) return;

        // deletingCoordinates include shipPlacement and cells around the ship
        const joinedDeletingCoordinates = deletingCoordinates.flat();
        const availableCoordinatesEntries = Object.entries(this.availableShipPlacements);

        for (const [length, coordinate] of availableCoordinatesEntries) {
            // deleting used coordinates
            const unusedCoordinates = coordinate.filter(arr => !arr.some(value => joinedDeletingCoordinates.includes(value)));
            this.availableShipPlacements[length] = unusedCoordinates;
        }
    }

    resetAvailableCoordinates() {
        // Rerunning #fillRandomShipPlacements will spike CPU usage. Making deep clone instead
        this.availableShipPlacements = JSON.parse(JSON.stringify(this.copy));
    }

    #fillRandomShipPlacements(boardCols, boardRows) {
        const shipPlacements = {
            4: [],
            3: [],
            2: [],
            1: [],
        };

        for (let i = 0; i < boardCols; i += 1) {
            for (let j = 0; j < boardRows; j += 1) {
                const allCoordinates = ShipRandomizer.#traverseAllPossibleCoordinates(i, j);

                const validRows = allCoordinates.rows.filter(row => this.#isCoordinatesValid(row));
                const validCols = allCoordinates.cols.filter(col => this.#isCoordinatesValid(col));

                const validCoordinates = [...validRows, ...validCols];

                // Filling up availableShipPlacements object
                validCoordinates.forEach(coordinate => {
                    const shipLength = coordinate.length;
                    const coordinatesToStr = coordinate.reduce((acc, el) => [...acc, el.toString()], []);
                    shipPlacements[shipLength].push(coordinatesToStr);
                });
            }
        }

        return shipPlacements;
    }

    #isCoordinatesValid(inputedCoordinates) {
        const validCoordinates = inputedCoordinates.filter(([x, y]) => x >= 0 && x < this.rows && y >= 0 && y < this.cols);
        return validCoordinates.length === inputedCoordinates.length;
    }
}


/***/ }),

/***/ "./src/components/Ship/ship.js":
/*!*************************************!*\
  !*** ./src/components/Ship/ship.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
    static shipsCreated = 0;

    #hitTimes = 0;

    #sunk = false;

    constructor(length) {
        this.length = Number(length);
        this.identificator = Ship.shipsCreated.toString();

        Ship.shipsCreated += 1;
    }

    get hitTimes() {
        return this.#hitTimes;
    }

    hit() {
        this.#hitTimes += 1;
        this.isSunk();
    }

    isSunk() {
        if (this.#hitTimes === this.length) {
            this.#sunk = true;
        }
        return this.#sunk;
    }
}


/***/ }),

/***/ "./src/components/UI/BoardUI.js":
/*!**************************************!*\
  !*** ./src/components/UI/BoardUI.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BoardUI)
/* harmony export */ });
/* harmony import */ var _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/PubSub */ "./src/utils/PubSub.js");


class BoardUI {
    static createBoardWrapper(className, name) {
        const boardWrapperEl = document.createElement("div");
        boardWrapperEl.className = className;
        boardWrapperEl.setAttribute("data-belonging", name);

        const playerTag = document.createElement("div");
        playerTag.textContent = name;
        playerTag.className = "player-tag";

        boardWrapperEl.append(playerTag);

        return boardWrapperEl;
    }

    static createBoardRow(className) {
        const rowEl = document.createElement("div");
        rowEl.className = className;

        return rowEl;
    }

    static createBoardCell(className, coordinate) {
        const cellEl = document.createElement("div");
        cellEl.className = className;
        cellEl.setAttribute("data-coordinate", coordinate);

        return cellEl;
    }

    static createAxisWithLettersOrNumbers(arr, axis) {
        const div = document.createElement("div");
        div.className = `axis-cell-wrapper ${axis}`;

        arr.forEach(el => {
            const cell = document.createElement("div");
            cell.className = "axis-cell";
            cell.textContent = el;
            div.append(cell);
        });

        return div;
    }

    static drawShipUI(length, className) {
        const shipDiv = document.createElement("div");
        shipDiv.setAttribute("data-length", length);
        shipDiv.setAttribute("draggable", true);
        shipDiv.setAttribute("data-axis", "horizontal");
        shipDiv.className = className;

        return shipDiv;
    }

    static drawShipCellUI(className) {
        const shipCell = document.createElement("div");
        shipCell.className = className;

        return shipCell;
    }

    constructor(boardToPlaceTo) {
        this.boardToPlaceTo = boardToPlaceTo;

        this.boardSelectorsNames = {
            boardRoot: "board__wrapper",
            boardRow: "board__wrapper__row",
            boardCell: "board__cell",
        };

        this.buttonSelectorsNames = {
            randomBtn: "random-ship-placement",
            readyBtn: "ready-state-btn",
            tryAgainBtn: "try-again_btn",
        };

        this.shipSelectorsNames = {
            shipCell: "ship-cell",
            ship: "ship",
        };

        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("addShip", this.displayShip.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("attack", this.displayAttackResult.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("updateShipsQuantity", this.displayShipsQuantity.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("gameEnded", this.showResultDialog.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("takeTurn", this.#highlightActivePlayer.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("reset", this.reset.bind(this));
    }

    createBoard(rows, cols, playerName) {
        const board = document.createElement("div");
        board.className = "board";

        const axisLetters = BoardUI.createAxisWithLettersOrNumbers(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], "vertical");
        const axisNumbers = BoardUI.createAxisWithLettersOrNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "horizontal");

        const boardWrapper = BoardUI.createBoardWrapper(this.boardSelectorsNames.boardRoot, playerName);
        boardWrapper.append(axisNumbers, axisLetters);

        for (let row = 0; row <= rows - 1; row += 1) {
            const boardRow = BoardUI.createBoardRow(this.boardSelectorsNames.boardRow);

            for (let col = 0; col <= cols - 1; col += 1) {
                const boardCell = BoardUI.createBoardCell(this.boardSelectorsNames.boardCell, `${row},${col}`);

                boardRow.append(boardCell);
            }
            board.append(boardRow);
        }
        boardWrapper.append(board);
        this.boardToPlaceTo.append(boardWrapper);
    }

    displayShip(data) {
        const { placedShipCoordinates, blockedCoordinates, name } = data;
        const playersBoard = document.querySelector(`[data-belonging = ${name}]`);
        placedShipCoordinates.forEach(coordinate => {
            const uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinate}']`);
            uiCell.classList.add("ship-placed");
        });
        blockedCoordinates.forEach(cell => {
            const uiCell = playersBoard.querySelector(`[data-coordinate = '${cell}']`);
            uiCell.classList.add("blocked");
        });
    }

    displayAttackResult(data) {
        const { coordinates, playerReceivingHitName, status, blockedCells } = data;
        const playersBoard = document.querySelector(`[data-belonging = ${playerReceivingHitName}]`);
        let uiCell = playersBoard.querySelector(`[data-coordinate = '${coordinates}']`);
        uiCell.classList.add(status);

        if (blockedCells) {
            blockedCells.forEach(cell => {
                uiCell = playersBoard.querySelector(`[data-coordinate = '${cell}'`);
                uiCell.classList.add("miss");
            });
        }
    }

    clearBoard(playerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${playerName}]`);

        const cellsOfBoard = playersBoard.querySelectorAll(`.${this.boardSelectorsNames.boardCell}`);
        cellsOfBoard.forEach(cell => {
            cell.className = this.boardSelectorsNames.boardCell;
        });
    }

    displayUI(data) {
        this.createBoard(10, 10, data.firstPlayerName);
        this.createBoard(10, 10, data.secondPlayerName);

        const shipWrapper = this.#drawShips(data.shipsQuantity);
        const btnGroup = this.#createBoardBtns();

        const controlDiv = document.createElement("div");
        controlDiv.className = `control-group`;
        controlDiv.append(shipWrapper, btnGroup);

        const board = document.querySelector(`.${this.boardSelectorsNames.boardRoot}`);
        board.insertAdjacentElement("afterend", controlDiv);

        this.#highlightActivePlayer([data.firstPlayerName, data.secondPlayerName]);

        this.createResultDialog();
    }

    displayShipsQuantity(shipsQuantity) {
        for (const [key, value] of shipsQuantity) {
            const shipQuantity = document.querySelector(`[data-length = '${key}'] + .quantity`);
            shipQuantity.textContent = `×${value}`;
        }
    }

    createResultDialog() {
        const resultDialog = document.createElement("dialog");
        resultDialog.className = "result-dialog";
        const dialogWrapper = document.createElement("div");

        const paragraph = document.createElement("p");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = this.buttonSelectorsNames.tryAgainBtn;
        btn.textContent = "Try again?";

        dialogWrapper.append(paragraph, btn);
        resultDialog.append(dialogWrapper);

        const controlGroup = document.querySelector(".control-group");
        controlGroup.append(resultDialog);
    }

    showResultDialog(winnerName) {
        const resultDialog = document.querySelector(".result-dialog");
        const paragraph = resultDialog.querySelector("p");
        paragraph.textContent = `${winnerName} has won!`;
        resultDialog.show();
    }

    reset(data) {
        const [activePlayerName, inactivePlayerName] = data;

        [activePlayerName, inactivePlayerName].forEach(playerName => {
            this.clearBoard(playerName);
        });
        this.#highlightActivePlayer([activePlayerName, inactivePlayerName]);
    }

    hideBlockedCells(inactivePlayerName) {
        const playersBoard = document.querySelector(`[data-belonging = ${inactivePlayerName}]`);
        const blockedCellsOfPlayerBoard = playersBoard.querySelectorAll(".blocked");
        blockedCellsOfPlayerBoard.forEach(cell => {
            cell.classList.remove("blocked");
        });
    }

    #drawShips(shipsData) {
        // Function accept array of arrays [["4", 1]] or Map object
        const shipWrapper = document.createElement("div");
        shipWrapper.className = "ship-wrapper horizontal";

        for (const [shipSize, quantity] of shipsData) {
            const shipWrapperQuantity = document.createElement("div");
            shipWrapperQuantity.className = "ship-wrapper__quantity";
            const span = document.createElement("span");
            span.className = "quantity";
            span.textContent = `×${quantity}`;

            const shipDiv = BoardUI.drawShipUI(shipSize, `${this.shipSelectorsNames.ship} vertical`);
            for (let j = 0; j < shipSize; j += 1) {
                const shipCell = BoardUI.drawShipCellUI(`cell ${this.shipSelectorsNames.shipCell}`);
                shipDiv.append(shipCell);
            }
            shipWrapperQuantity.append(shipDiv, span);
            shipWrapper.append(shipWrapperQuantity);
        }
        return shipWrapper;
    }

    #createBoardBtns() {
        const div = document.createElement("div");
        div.className = "btn_group";

        div.innerHTML = `
            <button class=${this.buttonSelectorsNames.randomBtn} type="button">Randomize ships</button>
            <button class=${this.buttonSelectorsNames.readyBtn} type="button" disabled=true>Ready</button>
            <button class="horizontal-axis-btn" type="button">
                <i class="fa-solid fa-left-right" style="color:#fff"></i>
            </button>
            <button class="vertical-axis-btn" type="button">
                <i class="fa-solid fa-up-down" style="color:#fff"></i>
            </button>`;

        return div;
    }

    #highlightActivePlayer(data) {
        const [activePlayerName, inactivePlayerName] = data;

        const playerTagActive = document.querySelector(`[data-belonging = '${activePlayerName}'] > .player-tag`);
        playerTagActive.classList.add("highlight");

        this.#removeHighlight(inactivePlayerName);
    }

    #removeHighlight(playerName) {
        const playerTagInactive = document.querySelector(`[data-belonging = '${playerName}'] > .player-tag`);
        playerTagInactive.classList.remove("highlight");
    }
}


/***/ }),

/***/ "./src/components/UI/StartScreenManager.js":
/*!*************************************************!*\
  !*** ./src/components/UI/StartScreenManager.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StartScreenManager)
/* harmony export */ });
/* harmony import */ var _Gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Gameboard/gameboard */ "./src/components/Gameboard/gameboard.js");
/* harmony import */ var _Randomizer_ShipRandomizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Randomizer/ShipRandomizer */ "./src/components/Randomizer/ShipRandomizer.js");
/* harmony import */ var _Player_Player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Player */ "./src/components/Player/Player.js");
/* harmony import */ var _Player_AiPlayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Player/AiPlayer */ "./src/components/Player/AiPlayer.js");
/* harmony import */ var _Player_AiBrains__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Player/AiBrains */ "./src/components/Player/AiBrains.js");
/* harmony import */ var _passDevice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./passDevice */ "./src/components/UI/passDevice.js");
/* harmony import */ var _Battleship_ActivePhase__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Battleship/ActivePhase */ "./src/components/Battleship/ActivePhase.js");
/* harmony import */ var _BoardUI__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BoardUI */ "./src/components/UI/BoardUI.js");
/* harmony import */ var _Controller_GameDisplayManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Controller/GameDisplayManager */ "./src/components/Controller/GameDisplayManager.js");










class StartScreenManager {
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
            aiBrains = new _Player_AiBrains__WEBPACK_IMPORTED_MODULE_4__["default"]();
        }

        const gameboard1 = new _Gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"](ROWS, COLS);
        const gameboard2 = new _Gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"](ROWS, COLS);
        const randomizer = new _Randomizer_ShipRandomizer__WEBPACK_IMPORTED_MODULE_1__["default"](ROWS, COLS);
        const player1 = new _Player_Player__WEBPACK_IMPORTED_MODULE_2__["default"]("P1", gameboard1, randomizer, dialogSelectedData.shipsQuantity);
        let player2;

        if (target.matches(".mode_btn")) {
            mode = target.getAttribute("data-mode");

            if (mode === "pvp") {
                player2 = new _Player_Player__WEBPACK_IMPORTED_MODULE_2__["default"]("P2", gameboard2, randomizer, dialogSelectedData.shipsQuantity);
                passDevice = new _passDevice__WEBPACK_IMPORTED_MODULE_5__["default"]();
            } else {
                player2 = new _Player_AiPlayer__WEBPACK_IMPORTED_MODULE_3__["default"]("AI", gameboard2, randomizer, dialogSelectedData.shipsQuantity, aiBrains);
            }
        }
        if (player2.type === "AI") passDevice = null; // ??? IF I have mode
        const game = new _Battleship_ActivePhase__WEBPACK_IMPORTED_MODULE_6__["default"](player1, player2, mode);

        const domPlayField = document.querySelector(".play-field");
        const boardUI = new _BoardUI__WEBPACK_IMPORTED_MODULE_7__["default"](domPlayField);

        boardUI.displayUI({
            firstPlayerName: player1.name,
            secondPlayerName: player2.name,
            shipsQuantity: dialogSelectedData.shipsQuantity,
        });

        if (passDevice) {
            passDevice.init();
        }

        const controller = new _Controller_GameDisplayManager__WEBPACK_IMPORTED_MODULE_8__["default"](game, boardUI);
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


/***/ }),

/***/ "./src/components/UI/passDevice.js":
/*!*****************************************!*\
  !*** ./src/components/UI/passDevice.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PassDevice)
/* harmony export */ });
/* harmony import */ var _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/PubSub */ "./src/utils/PubSub.js");


class PassDevice {
    #stash = {};

    #playersNames = {
        activePlayerName: null,
        inactivePlayerName: null,
    };

    init() {
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("takeTurn", this.activatePassDevice.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("takeTurn", this.#updatePlayersStatuses.bind(this));
        // pubsub.subscribe("endGame", this.#reset.bind(this));
        _utils_PubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("reset", this.#reset.bind(this));

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


/***/ }),

/***/ "./src/styles/reset-css.css":
/*!**********************************!*\
  !*** ./src/styles/reset-css.css ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/styles.css":
/*!*******************************!*\
  !*** ./src/styles/styles.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/utils/PubSub.js":
/*!*****************************!*\
  !*** ./src/utils/PubSub.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class PubSub {
    subscribers = {};

    subscribe(name, fn) {
        if (!this.subscribers[name]) {
            this.subscribers[name] = [];
        }
        this.subscribers[name].push(fn);
    }

    publish(name, data) {
        if (!this.subscribers[name]) return "No such subscriber";
        this.subscribers[name].forEach(sub => (data ? sub(data) : sub()));
    }
}

const pubsub = new PubSub();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pubsub);


/***/ }),

/***/ "./src/utils/randomNum.js":
/*!********************************!*\
  !*** ./src/utils/randomNum.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getRandomNum)
/* harmony export */ });
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_reset_css_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/reset-css.css */ "./src/styles/reset-css.css");
/* harmony import */ var _styles_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/styles.css */ "./src/styles/styles.css");
/* harmony import */ var _components_UI_StartScreenManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/UI/StartScreenManager */ "./src/components/UI/StartScreenManager.js");




_components_UI_StartScreenManager__WEBPACK_IMPORTED_MODULE_2__["default"].initListeners();

})();

/******/ })()
;
//# sourceMappingURL=sourceMap/main.js.map