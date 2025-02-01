import AssetManager from './classes/AssetManager.js'

// Initialize properties of the game
const gameProperties = {
	height: 1080,
	width: 1920,
	imageSmoothing: false
}

// Initialize function for dinamically scalling the canvas to fit the window
const resizeCanvas = () => {
	const windowBounds = document.body.getBoundingClientRect()
	const verticalRatio = windowBounds.height / gameProperties.height
	const horizontalRatio = windowBounds.width / gameProperties.width
	const ratio = verticalRatio < horizontalRatio ? verticalRatio : horizontalRatio
	canvas.style.transform = `scale(${ratio})`
}

const startGame = () => {
	// Initialize the game engine
	const gameEngine = new GameEngine(ctx)

	// Add entities to the game engine
	gameEngine.addEntity(new Goku(gameEngine))

	// Start the game engine
	gameEngine.start()
}

const initGame = () => {
	// Set the size of the canvas
	canvas.height = gameProperties.height
	canvas.width = gameProperties.width

	// Initilize function to fit canvas to window and set it to run on page's resize
	resizeCanvas()
	document.body.onresize = resizeCanvas

	// Set image smoothing for the context
	ctx.imageSmoothingEnabled = gameProperties.imageSmoothing

	// Initialize the asset manager
	const assetManager = new AssetManager()

	// Load assets
	assetManager.queueDownload('./Assets/goku running.png')
	assetManager.queueDownload('./Assets/goku_jump.png')
	assetManager.queueDownload('./Assets/goku_sprites.png')

	// Download assets and start the game
	assetManager.downloadAll(startGame)
}

// Set canvas and its context to variable
const canvas = document.querySelector('canvas')
const ctx = canvas?.getContext('2d')

if (ctx instanceof CanvasRenderingContext2D) {
	initGame()
}