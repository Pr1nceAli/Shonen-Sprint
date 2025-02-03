import gameProperties from './classes/gameProperties.js'
import AssetManager from './classes/AssetManager.js'
import GameEngine from './classes/GameEngine.js'
import Goku from './classes/Goku.js'
import Obstacle from './classes/Obstacle.js'
import Buu from './classes/Buu.js'

// Initialize function for dinamically scalling the canvas to fit the window
const resizeCanvas = () => {
	const windowBounds = document.body.getBoundingClientRect()
	const verticalRatio = windowBounds.height / gameProperties.height
	const horizontalRatio = windowBounds.width / gameProperties.width
	const ratio = verticalRatio < horizontalRatio ? verticalRatio : horizontalRatio
	canvas.style.transform = `scale(${ratio})`
}

// Initialize function to start the game
const startGame = () => {
	const gameEngine = new GameEngine(ctx, assetManager)
	gameEngine.addEntity(new Goku(gameEngine, 100, 820, 3))
	gameEngine.addEntity(new Obstacle(gameEngine, 1700, 905, 0.15))
	setTimeout(()=>{gameEngine.addEntity(new Buu(gameEngine,25, 850,0.30))},1000)

	
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

	// Load assets
	
	assetManager.queueDownload('assets/goku/sprites.png')
	assetManager.queueDownload('assets/goku/running.png')
	assetManager.queueDownload('assets/goku/jumping.png')
	assetManager.queueDownload('assets/goku/obstacle.png')
	assetManager.queueDownload('assets/buu/buu.png')
	// Download assets and start the game
	assetManager.downloadAll(startGame)
}

// Set canvas and its context to variable
const canvas = document.querySelector('canvas')
const ctx = canvas?.getContext('2d')


// Initialize the asset manager
const assetManager = new AssetManager()
// If the context is a CanvasRenderingContext2D, initialize the game
if (ctx instanceof CanvasRenderingContext2D) {
	initGame()
}