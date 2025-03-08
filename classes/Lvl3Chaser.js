import Entity from './Entity.js'
import Animator from './Animator.js'
import Shuriken from './Shuriken.js'

class Lvl3Chaser extends Entity {
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
		this.height = 55
		this.speed = 520
		this.throwShurikenTimeInterval = 3
		this.throwShurikenTimeout = this.throwShurikenTimeInterval
		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('../assets/lvl3/chaser.png')
		// Create the animations

		this.running = new Animator(spriteSheet, 14, 450, 69, 55, 6, 0.10)
		
	}

	calculateSpeed() {
		const keepDistance = 1000;
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

		this.throwShurikenTimeout -= this.gameEngine.clockTick;
		if (this.throwShurikenTimeout <= 0) {
			this.gameEngine.addEntity(new Shuriken(this.gameEngine, this.x + 100, this.y, 0.075, -1200));
			this.throwShurikenTimeout = this.throwShurikenTimeInterval;
		}
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
		let [screenX, screenY] = this.gameEngine.camera.getScreenPosition(this);

		this.running.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale*11, this.paddingX, this.paddingY)
	}
}

export default Lvl3Chaser
