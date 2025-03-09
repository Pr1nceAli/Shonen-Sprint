import Entity from './Entity.js'
import Animator from './Animator.js'
import gameProperties from './gameProperties.js'

class Obstacle extends Entity {
	/**
	 * Create a new obstacle.
	 * @param {CanvasRenderingContext2D} gameEngine - The context of the canvas.
	 * @param {number} x - The x coordinate of the entity.
	 * @param {number} y - The y coordinate of the entity.
	 * @param {number} scale - The scale of the entity.
	 */
	constructor(gameEngine, x = 0, y = 0, scale = 1) {
		super(gameEngine, x, y, scale)

		this.width = 625
		this.height = 574
		this.paddingX = 5
		this.paddingY = 5
		this.velocity = gameProperties.speed

		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('../assets/goku/obstacle.png')
		this.sprite = new Animator(spriteSheet, 0, 0, this.width, this.height, 1, 1)
	}

	/**
	 * Update the entity's state
	 */
	update() {
		this.x -= this.velocity * this.gameEngine.clockTick

		let [sx, sy] = this.gameEngine.camera.getScreenPosition(this);

		if(sx < 0) 
			this.x += (this.gameEngine.camera.getWidth() + this.width);
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
		let [screenX, screenY] = this.gameEngine.camera.getScreenPosition(this);
		this.sprite.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale)
	}
}

export default Obstacle