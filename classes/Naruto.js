import Entity from './Entity.js'
import Animator from './Animator.js'
import Buu from './Buu.js';
import Obstacle from './Obstacle.js';
import Shuriken from './Shuriken.js';
import Lvl3Chaser from './Lvl3Chaser.js';

class Naruto extends Entity {
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
		this.distanceTraveled = 0;
		this.farthestX = x;

		this.loadSpriteSheets()
	}

	/**
	 * Load the sprite sheets for the entity
	 */
	loadSpriteSheets() {
		const spriteSheet = this.gameEngine.assetManager.getAsset('../assets/lvl3/naruto.png')

		// Create the animations
		this.idle = new Animator(spriteSheet, 23, 345, 57, 58, 6, 0.1)
		this.running = new Animator(spriteSheet, 376, 466, 64, 51, 6, 0.09)
		this.jumping = new Animator(spriteSheet, 6, 688, 62, 75, 4, 0.2)
	}

	calculateSpeed() {
		const keepDistance = 1000;
		let distance = Math.abs(this.x - this.pursuer.x);
		if (distance < keepDistance) {
			let additionalSpeed = distance / keepDistance * 200;
			return this.speed + additionalSpeed;
		}

		return this.speed;
	}

	/**
	 * Update the entity's state
	 */
	update() {
		// Reset the velocity
		this.velocity = 0

		let speed = this.calculateSpeed();
		let prevX = this.x;
		let farthestX = 0;

		// Check if the entity is moving left or right
		if (
			this.gameEngine.keys['d'] ||
			this.gameEngine.keys['ArrowRight']
		) {
			this.velocity = speed
		} else if (
			this.gameEngine.keys['a'] ||
			this.gameEngine.keys['ArrowLeft']
		) {
			this.velocity = -speed
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

		if (this.x > this.farthestX) {
			this.distanceTraveled += this.x - this.farthestX; // Only count new distance forward
			this.farthestX = this.x; 
		}

		//Increasing the distance traveled when only going forward
		
		
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
		if (otherEntity instanceof Buu || otherEntity instanceof Lvl3Chaser || otherEntity instanceof Obstacle || otherEntity instanceof Shuriken) {
			this.gameEngine.running = false;

			// alert('Game over!')
			// window.location.reload()
			window.location.href = './game_over.html?level=3';
		}

		
	}
}

export default Naruto