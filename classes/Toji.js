import Entity from './Entity.js'
import Animator from './Animator.js'

class Toji extends Entity {
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
		this.speed = 600
		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const running = this.gameEngine.assetManager.getAsset('../assets/gojo/toji run.png')
		// Create the animations

		this.running = new Animator(running, 0, 22, 218, 180, 10, 0.1)
		
	}

	calculateSpeed() {
		const keepDistance = 500;
		let distance = Math.abs(this.x - this.target.x);
		if (distance > keepDistance || this.x > this.target.x) {
			let additionalSpeed = distance / keepDistance * 300;
			return this.speed + additionalSpeed;
		}

		return this.speed;
	}

	/**
	 * Update the entity's state
	 */
	update() {
		this.x += this.calculateSpeed() * this.gameEngine.clockTick;

		let [sx, sy] = this.gameEngine.camera.getScreenPosition(this);

    	if(sx > this.gameEngine.camera.getWidth()) 
			this.x -= (this.gameEngine.camera.getWidth() + this.width * 4);
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
		let [screenX, screenY] = this.gameEngine.camera.getScreenPosition(this);

		this.running.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale*5, this.paddingX, this.paddingY)
	}
}

export default Toji
