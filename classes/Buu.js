import Entity from './Entity.js'
import Animator from './Animator.js'

class Buu extends Entity {
	/**
	 * Create a new obstacle.
	 * @param {CanvasRenderingContext2D} gameEngine - The context of the canvas.
	 * @param {number} x - The x coordinate of the entity.
	 * @param {number} y - The y coordinate of the entity.
	 * @param {number} scale - The scale of the entity.
	 */
	constructor(gameEngine, x = 0, y = 0, scale = 1) {
		super(gameEngine, x, y, scale, false)

		this.paddingX = 15
		this.paddingY = 10
		this.width = 34
		this.height = 60
		this.speed = 320
		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('/assets/buu/buu.png')
		// Create the animations

		this.running = new Animator(spriteSheet, 0, 0, 68, 60, 8, 0.10)
		
	}

	/**
	 * Update the entity's state
	 */
	update() {
		this.x += this.speed * this.gameEngine.clockTick
      if(this.x > this.gameEngine.ctx.canvas.width) this.x = 0
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
			this.running.drawFrame(this.gameEngine.clockTick, ctx, this.x, this.y, this.scale*11, this.paddingX, this.paddingY)
	}
}

export default Buu