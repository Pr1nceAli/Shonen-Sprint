import Entity from './Entity.js'
import Animator from './Animator.js'
import Buu from './Buu.js';
import Obstacle from './Obstacle.js';
import Shuriken from './Shuriken.js';
import Toji from './Toji.js';

class Gojo extends Entity {
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
		this.height = 75
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
		const idle = this.gameEngine.assetManager.getAsset('../assets/gojo/Idle.png')
        const walking = this.gameEngine.assetManager.getAsset('../assets/gojo/gojo walk.png')
		const jumping = this.gameEngine.assetManager.getAsset('../assets/gojo/gojo jump.png')

		// Create the animations
		this.idle = new Animator(idle, 0, 0, 26, 73, 1, 0.45)
		this.walking = new Animator(walking, 0, 0, 42, 83, 6, 0.15)
		this.jumping = new Animator(jumping, 0, 50, 30, 100, 5, 0.25)
	}

	calculateSpeed() {
		const keepDistance = 500;
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
			this.walking.reverse = this.velocity < 0;
			this.walking.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale, this.paddingX, this.paddingY)
		} else {
			this.idle.drawFrame(this.gameEngine.clockTick, ctx, screenX, screenY, this.scale, this.paddingX, this.paddingY)
		}
	}

	onCollision(otherEntity) {
		if (otherEntity instanceof Toji || otherEntity instanceof Obstacle) {
			this.gameEngine.running = false;

			alert('Game over!')
			window.location.reload()
		}

		
	}
}

export default Gojo