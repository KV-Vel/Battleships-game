import getRandomNum from "../../utils/randomNum";

export default class AIbrains {
    #brainState = {
        firstHit: null,
        lastHit: null,
        attackDirection: null,
    };

    generatePossibleSmartGuesses(enemyGameboard, coords, aiGuesses) {
        if (!this.#brainState.firstHit) {
            this.#brainState.firstHit = this.#setBrainStateHit(coords, enemyGameboard, aiGuesses);
        } else {
            this.#brainState.lastHit = this.#setBrainStateHit(coords, enemyGameboard, aiGuesses);

            const foundAttackDirection = this.#findDirection(
                this.#brainState.firstHit.initialHitCoords,
                this.#brainState.lastHit.initialHitCoords,
            );

            this.#brainState.attackDirection = foundAttackDirection;
            const directionToDelete = foundAttackDirection === "horizontal" ? "vertical" : "horizontal";

            this.#brainState.firstHit[directionToDelete] = [];
            this.#brainState.lastHit[directionToDelete] = [];
        }
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

        randomAxis = this.#getRandomAxis(this.#brainState.firstHit);
        const randomAxisCoordIndex = getRandomNum(0, this.#brainState.firstHit[randomAxis].length);

        guess = this.#brainState.firstHit[randomAxis][randomAxisCoordIndex];
        const reducedGuesses = this.#brainState.firstHit[randomAxis].filter(coords => coords !== guess);
        this.#brainState.firstHit[randomAxis] = reducedGuesses;

        return guess.join(",");
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

    resetPossibleSmartGuesses() {
        this.#brainState = {
            initialHitCoords: null,
            firstHit: null,
            lastHit: null,
            attackDirection: null,
        };
    }

    #findDirection(firstCoords, lastCoords) {
        const [firstXCoords, firstYCoords] = firstCoords.split(",");
        const [lastXCoords, lastYCoords] = lastCoords.split(",");
        // If first number of coordinates is different that it is vertical, otherwise horizontal
        return firstXCoords === lastXCoords ? "horizontal" : "vertical";
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
