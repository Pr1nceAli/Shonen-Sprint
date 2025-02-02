class Timer {
    constructor() {
        /**
         * The game time
         * @type {number}
         */
        this.gameTime = 0

        /**
         * The maximum step of the game
         * @type {number}
         */
        this.maxStep = 0.05

        /**
         * The last timestamp of the game
         * @type {number}
         */
        this.lastTimestamp = 0
    }

    /**
     * Updates the game time
     * @returns {number} The game delta
     */
    tick() {
        // Calculate the delta
        const current = Date.now()
        const delta = (current - this.lastTimestamp) / 1000
        this.lastTimestamp = current

        // Return the game delta
        const gameDelta = Math.min(delta, this.maxStep)
        this.gameTime += gameDelta
        return gameDelta
    }
}

export default Timer