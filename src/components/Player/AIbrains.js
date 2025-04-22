import getRandomNum from "../../utils/randomNum";

export default class AiBrains {
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
        const randomAxisCoordIndex = getRandomNum(0, this.#brainState.firstHit[randomAxis].length);

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
        const randomNumber = getRandomNum(0, 2);
        let randomAxis = randomNumber === 1 ? "vertical" : "horizontal";

        // If randomAxis is empty, we get another axis that should be filled with value
        if (!hitObject[randomAxis] || !hitObject[randomAxis].length) {
            randomAxis = randomAxis === "vertical" ? "horizontal" : "vertical";
        }

        return randomAxis;
    }
}
