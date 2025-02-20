import Entity from './Entity.js'

class Ground extends Entity {
	/**
	 * Create a new obstacle.
	 * @param {CanvasRenderingContext2D} gameEngine - The context of the canvas.
	 * @param {number} x - The x coordinate of the entity.
	 * @param {number} y - The y coordinate of the entity.
	 * @param {number} scale - The scale of the entity.
	 */
	constructor(gameEngine, x = 0, y = 0, scale = 1) {
		super(gameEngine, x, y, scale)

		this.width = 10000000
		this.height = 2000
		this.paddingX = 0
		this.paddingY = 0
	}


	update() {
	}

	draw(ctx) {
	}
}

export default Ground