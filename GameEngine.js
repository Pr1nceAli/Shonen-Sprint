const Entity = require('./Entity')

/**
 * @typedef {Object} GameEngineOptions
 * @property {boolean} debugging - Prints all steps in the console
 */

/**
 * @typedef {Object} PositionalCoordinates
 * @property {number} x - The x coordinate
 * @property {number} y - The y coordinate
 */

/** Class representing a game engine */
class GameEngine {
	/**
	 * Create a new game engine
	 * @param {CanvasRenderingContext2D} ctx - The context of the canvas
	 * @param {GameEngineOptions | null} options - Options for the game engine
	 */
	constructor(ctx, options = { debugging: false }) {
		/**
		 * The context of the canvas
		 * @type {CanvasRenderingContext2D}
		 */
		this.ctx = ctx

		/**
		 * Stores the entities of the game
		 * @type {Array<Object>}
		 */
		this.entities = []

		/**
		 * Stores the coordinates of the click event
		 * @type {PositionalCoordinates}
		 */
		this.click = null

		/**
		 * Stores the coordinates of the right click event
		 * @type {PositionalCoordinates}
		 */
		this.rightClick = null

		/**
		 * Stores the coordinates of the mouse move event
		 * @type {PositionalCoordinates}
		 */
		this.mouse = null

		/**
		 * Stores the wheel event
		 * @type {WheelEvent}
		 */
		this.wheel = null

		/**
		 * Stores the keys that are currently pressed
		 * @type {{ [key: string]: boolean }}
		 */
		this.keys = {}

		/**
		 * Options for the game engine
		 * @type {GameEngineOptions}
		 */
		this.options = options

		// Initialize the input events and the timer of the game
		this.initInput()
		this.timer = new Timer()
	}

	/**
	 * Log a message to the console if debugging is enabled
	 * @param {string} message - The message to log
	 * @param {any} value - The debugging value to log
	 */
	debug(message = '', value) {
		if (!this.debugging) return

		if (value === undefined) {
			console.log(message)
		} else {
			console.log(message, value)
		}
	}

	/**
	 * Initializes the input events of the game
	 */
	initInput() {
		this.ctx.canvas.addEventListener('mousemove', e => {
			this.mouse = this.getXY(e)
			this.debug('Mouse move event:', this.mouse)
		})

		this.ctx.canvas.addEventListener('wheel', e => {
			// Prevent the default action of scrolling the page
			e.preventDefault()

			this.wheel = e
			this.debug('Wheel event:', this.wheel)
		})

		this.ctx.canvas.addEventListener('click', e => {
			this.click = this.getXY(e)
			this.debug('Click event:', this.click)
		})

		this.ctx.canvas.addEventListener('contextmenu', e => {
			// Prevent the default action of context menu
			e.preventDefault()

			this.rightClick = this.getXY(e)
			this.debug('Right click event:', this.rightClick)
		})

		this.ctx.canvas.addEventListener('keydown', e => {
			this.keys[e.key] = true
			this.debug('Key down event:', this.keys)
		})

		this.ctx.canvas.addEventListener('keyup', e => {
			this.keys[e.key] = false
			this.debug('Key up event:', this.keys)
		})
	}

	/**
	 * Get the coordinate position of the event
	 * @param {MouseEvent | WheelEvent | KeyboardEvent} e - The event
	 * @returns {PositionalCoordinates} The x and y coordinates of the event
	 */
	getXY = e => {
		if (!(
			e instanceof MouseEvent ||
			e instanceof WheelEvent ||
			e instanceof KeyboardEvent
		)) {
			throw new Error('The event must be an instance of MouseEvent, WheelEvent or KeyboardEvent', e)
		}

		const { top, left } = this.ctx.canvas.getBoundingClientRect()
		const x = e.clientX - left
		const y = e.clientY - top
		return { x, y }
	}

	/**
	 * Add an entity to the game
	 * @param {Entity} entity - The entity to add
	 */
	addEntity(entity) {
		if (!(entity instanceof Entity)) {
			throw new Error('The entity must be an instance of Entity', entity)
		}

		this.entities.push(entity)
	}

	/**
	 * Remove an entity from the game
	 * @param {Entity} entity - The entity to remove
	 */
	removeEntity(entity) {
		if (!(entity instanceof Entity)) return

		this.entities = this.entities.filter(e => e !== entity)
	}

	/**
	 * Draw the entities of the game (starting from the last entity)
	 */
	draw() {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

		// Draw the entities in reverse order
		this.entities.slice().reverse().forEach(entity => {
			entity.draw(this.ctx)
		})
	}

	/**
	 * Update the entities of the game
	 */
	update() {
		this.entities.forEach(entity => {
			if (!entity.removeFromWorld) {
				entity.update(this)
			}
		})

		// Remove entities that should be removed
		this.entities = this.entities.filter(entity => !entity.removeFromWorld)
	}

	/**
	 * Run the render loop of the game
	 */
	renderLoop() {
		this.clockTick = this.timer.tick()
		this.update()
		this.draw()
	}
}

module.exports = GameEngine