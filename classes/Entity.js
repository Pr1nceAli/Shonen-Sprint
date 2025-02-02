import GameEngine from './GameEngine.js'

class Entity {
	/**
	 * Create a new obstacle
	 * @param {CanvasRenderingContext2D} gameEngine - The context of the canvas
	 * @param {number} x - The x coordinate of the entity
	 * @param {number} y - The y coordinate of the entity
	 * @param {number} scale - The scale of the entity
	 * @param {boolean} isPlayer - The boolean to check if the entity is the player
	 */
	constructor(gameEngine, x = 0, y = 0, scale = 1, isPlayer = false) {
		/**
		 * The game engine of the entity
		 * @type {GameEngine}
		 */
		this.gameEngine = gameEngine

		/**
		 * The x coordinate of the entity
		 * @type {number}
		 */
		this.x = x

		/**
		 * The y coordinate of the entity
		 * @type {number}
		 */
		this.y = y

		/**
		 * The width of the entity
		 * @type {number}
		 */
		this.width = 0

		/**
		 * The height of the entity
		 * @type {number}
		 */
		this.height = 0

		/**
		 * The horizontal padding of the entity
		 * @type {number}
		 */
		this.paddingX = 0

		/**
		 * The vertical padding of the entity
		 * @type {number}
		 */
		this.paddingY = 0

		/**
		 * The scale of the entity
		 * @type {number}
		 */
		this.scale = scale

		/**
		 * The boolean to check if the entity is the player
		 */
		this.isPlayer = isPlayer

		/**
		 * The boolean to check if the entity should be removed from the world
		 * @type {boolean}
		 */
		this.removeFromWorld = false
	}
}

export default Entity