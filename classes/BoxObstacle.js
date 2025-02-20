import Entity from './Entity.js'
import Animator from './Animator.js'
import gameProperties from './gameProperties.js'

class BoxObstacle extends Entity {
	/**
	 * Create a new obstacle.
	 * @param {CanvasRenderingContext2D} gameEngine - The context of the canvas.
	 * @param {number} x - The x coordinate of the entity.
	 * @param {number} y - The y coordinate of the entity.
	 * @param {number} scale - The scale of the entity.
	 */
	constructor(gameEngine, x = 0, y = 0, scale = 1) {
		super(gameEngine, x, y, scale)

		this.width = 19
		this.height = 19
		this.paddingX = 5
		this.paddingY = 5

		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('/assets/boxes_barrels.png')
		this.sprite = new Animator(spriteSheet, 88, 154, this.width, this.height, 1, 1)
	}

	/**
	 * Update the entity's state
	 */
	update() {
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
		let [screenX, screenY] = this.gameEngine.camera.getScreenPosition(this);
		this.sprite.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale)
	}
}

export default BoxObstacle