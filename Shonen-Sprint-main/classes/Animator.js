import gameProperties from './gameProperties.js'

class Animator {
	constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
		Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration})

		this.elapsedTime = 0
		this.totalTime = frameCount * frameDuration
		this.reverse = false
	}

	drawFrame(tick, ctx, x = 0, y = 0, zoom = 1, paddingX = 0, paddingY = 0) {
		if (!(ctx instanceof CanvasRenderingContext2D)) {
			throw new Error('The context must be an instance of CanvasRenderingContext2D', ctx)
		}

		this.elapsedTime += tick
		if(this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime
		const frame = this.currentFrame()

		if (this.reverse) {
			ctx.save()
			ctx.scale(-1, 1)
			ctx.translate(ctx.width, 0)
		}

		if (this.reverse) {
			x = -(x + this.width)
		}

		if (gameProperties.options.debugging) {
			ctx.fillStyle = 'black'
			ctx.beginPath()
			ctx.rect(x, y, this.width * zoom, this.height * zoom)
			ctx.fill()

			ctx.fillStyle = 'blue'
			ctx.beginPath()
			ctx.rect(x + paddingX, y + paddingY, this.width * zoom - paddingX * 2, this.height * zoom - paddingY * 2)
			ctx.fill()
		}

		ctx.drawImage(
			this.spritesheet,
			this.xStart + this.width * frame, this.yStart,
			this.width, this.height,
			x, y,
			this.width * zoom, this.height * zoom
		)

		if (this.reverse) {
			ctx.restore()
		}
	}

	currentFrame() {
		return Math.floor(this.elapsedTime / this.frameDuration)
	}

	isDone() {
		return this.elapsedTime >= this.totalTime
	}
}

export default Animator