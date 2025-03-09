import Entity from './Entity.js'
import AssetManager from './AssetManager.js'
import Timer from './Timer.js'
import gameProperties from './gameProperties.js'
import Camera from './Camera.js'

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
	 * @param {AssetManager} assetManager - The asset manager of the game
	 */
	constructor(ctx, assetManager) {
		/**
		 * The context of the canvas
		 * @type {CanvasRenderingContext2D}
		 */
		this.ctx = ctx

		/**
		 * The asset manager of the game
		 */
		this.assetManager = assetManager

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

		// Initialize the input events and the timer of the game
		this.initInput()
		this.timer = new Timer()

		this.camera = new Camera(this, 0, 0)
	}

	/**
	 * Log a message to the console if debugging is enabled
	 * @param {string} message - The message to log
	 * @param {any} value - The debugging value to log
	 */
	debug(message = '', value) {
		if (!gameProperties.options.debugging) return

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
	addEntity(entity, priority = 0) {
		if (!(entity instanceof Entity)) {
			throw new Error('The entity must be an instance of Entity', entity)
		}

		entity.priority = priority
		this.entities.push(entity)
		console.log(this.entities)
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
	updateEntities() {
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
	renderInit() {
		this.clockTick = this.timer.tick()
		this.sortEntities()
		this.updateEntities()
		this.checkCollisions()

		this.draw()
	}

	/**
	 * Run the render loop of the game
	 */
	renderLoop() {
		if (!this.running) return

		this.clockTick = this.timer.tick()
		this.sortEntities()
		this.updateEntities()
		this.checkCollisions()

		this.draw()
	}

	sortEntities() {
		this.entities.sort((a, b) => a.priority - b.priority)
	}

	/**
	 * Start the game
	 */
	start() {
		this.running = true

		const gameLoop = () => {
			this.renderLoop()
			requestAnimFrame(gameLoop, this.ctx.canvas)
		}
		gameLoop()
	}

	/**
	 * Check if the player is colliding with any obstacle
	 */
	checkCollisions() {
		let push = {
			x: 0, y: 0
		}

		for (const entity of this.entities) {
			if (entity instanceof Entity && entity.isPlayer) {
				entity.isGrounded = false

				for (const otherEntity of this.entities) {
					if (otherEntity instanceof Entity && entity !== otherEntity) {
						if (this.checkCollision(entity, otherEntity, push)) {
							if (push.y < 0){
								entity.isJumping = false
								entity.isGrounded = true
							}
							
							entity.onCollision(otherEntity)
						}
					}
				}
			}
		}
	}

	/**
	 * Check if two entities are colliding
	 * @param {Entity} playerEntity 
	 * @param {Entity} collidableEntity 
	 * @returns 
	 */
	checkCollision(playerEntity, collidableEntity, push) {
		push.x = 0
		push.y = 0

		const pLeft = playerEntity.x + playerEntity.paddingX
		const pTop = playerEntity.y + playerEntity.paddingY
		const pWidth = playerEntity.width * playerEntity.scale - playerEntity.paddingX * 2
		const pHeight = playerEntity.height * playerEntity.scale - playerEntity.paddingY * 2
		const pRight = pLeft + pWidth
		const pBottom = pTop + pHeight

		const cLeft = collidableEntity.x + collidableEntity.paddingX
		const cTop = collidableEntity.y + collidableEntity.paddingY
		const cWidth = collidableEntity.width * collidableEntity.scale - collidableEntity.paddingX * 2
		const cHeight = collidableEntity.height * collidableEntity.scale - collidableEntity.paddingY * 2
		const cRight = cLeft + cWidth
		const cBottom = cTop + cHeight

		if (pRight > cLeft && pLeft < cRight && pBottom > cTop && pTop < cBottom) {
			const overlapX = Math.min(pRight - cLeft, cRight - pLeft)
			const overlapY = Math.min(pBottom - cTop, cBottom - pTop)

			if (overlapX < overlapY) {
				if (pRight - cLeft < cRight - pLeft) {
					push.x = cLeft - pWidth - playerEntity.paddingX - playerEntity.x
					playerEntity.x += push.x
				} else {
					push.x = cRight - playerEntity.paddingX - playerEntity.x
					playerEntity.x += push.x
				}
			} else {
				if (pBottom - cTop < cBottom - pTop) {
					push.y = cTop - pHeight - playerEntity.paddingY - playerEntity.y
					playerEntity.y += push.y
				} else {
					push.y = cBottom - playerEntity.paddingY - playerEntity.y
					playerEntity.y += push.y
				}
			}
			return true
		}

		return false
	}
}

export default GameEngine