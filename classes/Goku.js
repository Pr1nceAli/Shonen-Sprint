import Entity from './Entity.js'
import Animator from './Animator.js'

class Goku extends Entity {
	/**
	 * Create a new obstacle.
	 * @param {CanvasRenderingContext2D} gameEngine - The context of the canvas.
	 * @param {number} x - The x coordinate of the entity.
	 * @param {number} y - The y coordinate of the entity.
	 * @param {number} scale - The scale of the entity.
	 */
	constructor(gameEngine, x = 0, y = 0, scale = 1) {
		super(gameEngine, x, y, scale, true)

		this.paddingX = 15
		this.paddingY = 10
		this.width = 37
		this.height = 60
		this.speed = 520
		this.velocity = 0
		this.isJumping = false
		this.jumpVelocity = 0
		this.gravity = 1500
		this.initialJumpVelocity = -800

		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('/assets/goku/sprites.png')
		const jumpingSpriteSheet = this.gameEngine.assetManager.getAsset('/assets/goku/jumping.png')

		// Create the animations
		this.idle = new Animator(spriteSheet, 622, 124, 37, 60, 2, 0.45)
		this.running = new Animator(spriteSheet, 236, 270, 46, 60, 4, 0.15)
		this.jumping = new Animator(jumpingSpriteSheet, 2, 3, 36, 64, 4, 0.25)
	}

	/**
	 * Update the entity's state
	 */
	update() {
		// Reset the velocity
		this.velocity = 0

		// Check if the entity is moving left or right
		if (
			this.gameEngine.keys['d'] ||
			this.gameEngine.keys['ArrowRight']
		) {
			this.velocity = this.speed
		} else if (
			this.gameEngine.keys['a'] ||
			this.gameEngine.keys['ArrowLeft']
		) {
			this.velocity = -this.speed
		}

		// Move the entity horizontally
		this.x += this.velocity * this.gameEngine.clockTick

		// Check if the entity is jumping
		if (
			!this.isJumping && (
				this.gameEngine.keys['w'] ||
				this.gameEngine.keys['ArrowUp']
			)
		) {
			this.isJumping = true
			this.jumpVelocity = this.initialJumpVelocity
		}

		if (this.isJumping) {
			this.y += this.jumpVelocity * this.gameEngine.clockTick
			this.jumpVelocity += this.gravity * this.gameEngine.clockTick
			
			if (this.y >= 820) {
				this.y = 820
				this.isJumping = false
			}
		}
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
		if (this.isJumping) {
			this.jumping.drawFrame(this.gameEngine.clockTick, ctx, this.x, this.y, this.scale, this.paddingX, this.paddingY)
		} else if (this.velocity !== 0) {
			this.running.drawFrame(this.gameEngine.clockTick, ctx, this.x, this.y, this.scale, this.paddingX, this.paddingY)
		} else {
			this.idle.drawFrame(this.gameEngine.clockTick, ctx, this.x, this.y, this.scale, this.paddingX, this.paddingY)
		}
	}
}

export default Goku