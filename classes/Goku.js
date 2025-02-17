import Entity from './Entity.js'
import Animator from './Animator.js'
import Buu from './Buu.js';
import Obstacle from './Obstacle.js';
import Shuriken from './Shuriken.js';

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

		this.screenX = x;
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
		this.isGrounded = true

		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('assets/goku/sprites.png')
		const jumpingSpriteSheet = this.gameEngine.assetManager.getAsset('assets/goku/jumping.png')

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
		let xDelta = this.velocity * this.gameEngine.clockTick;
        this.x += xDelta;
        this.screenX += xDelta;

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

		
		this.jumpVelocity += this.gravity * this.gameEngine.clockTick;
		

		if (!this.isGrounded) {
			this.y += this.jumpVelocity * this.gameEngine.clockTick;
		}
		else {
			this.isJumping = false;
			this.jumpVelocity = 0;
		}

		const maxRight = this.gameEngine.ctx.canvas.width - this.gameEngine.ctx.canvas.width * 0.4;
        const minLeft = this.gameEngine.ctx.canvas.width * 0.2;

		let [screenX, screenY] = this.gameEngine.camera.getScreenPosition(this);

		if (screenX > maxRight) {
			this.gameEngine.camera.x += screenX - maxRight;
		}

		if (screenX < minLeft) {
			this.gameEngine.camera.x -= minLeft - screenX;
		}

		if (this.gameEngine.camera.x < 0)
			this.gameEngine.camera.x = 0
	}

	/**
	 * Draw the entity on canvas
	 */
	draw(ctx) {
		let [screenX, screenY] = this.gameEngine.camera.getScreenPosition(this);

		if (this.isJumping) {
			this.jumping.reverse = this.velocity < 0;
			this.jumping.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale, this.paddingX, this.paddingY)
		} else if (this.velocity !== 0) {
			this.running.reverse = this.velocity < 0;
			this.running.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale, this.paddingX, this.paddingY)
		} else {
			this.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale, this.paddingX, this.paddingY)
		}
	}

	onCollision(otherEntity) {
		if (otherEntity instanceof Buu || otherEntity instanceof Obstacle || otherEntity instanceof Shuriken) {
			this.gameEngine.running = false;

			alert('Game over!')
			window.location.reload()
		}

		
	}
}

export default Goku