import gameProperties from './classes/gameProperties.js'
import AssetManager from './classes/AssetManager.js'
import GameEngine from './classes/GameEngine.js'
import Goku from './classes/Goku.js'
import Obstacle from './classes/Obstacle.js'
import Buu from './classes/Buu.js'
import Shuriken from './classes/Shuriken.js'
import BoxObstacle from './classes/BoxObstacle.js'
import Ground from './classes/Ground.js'
import {Background, BackgroundLayer} from './classes/Background.js'

// Initialize function for dinamically scalling the canvas to fit the window
const resizeCanvas = () => {
	const windowBounds = document.body.getBoundingClientRect()
	const verticalRatio = windowBounds.height / gameProperties.height
	const horizontalRatio = windowBounds.width / gameProperties.width
	const ratio = verticalRatio < horizontalRatio ? verticalRatio : horizontalRatio
	canvas.style.transform = `scale(${ratio})`
}

const createBg = (game) => {
	let layers = [
		new BackgroundLayer(game.assetManager.getAsset('assets/bg/hills/layer_01.png'), .2),
		new BackgroundLayer(game.assetManager.getAsset('assets/bg/hills/layer_02.png'), .5),
		new BackgroundLayer(game.assetManager.getAsset('assets/bg/hills/layer_03.png'), .75),
		new BackgroundLayer(game.assetManager.getAsset('assets/bg/hills/layer_04.png'), 1),
		new BackgroundLayer(game.assetManager.getAsset('assets/bg/hills/layer_05.png'), 1),
		new BackgroundLayer(game.assetManager.getAsset('assets/bg/hills/layer_06.png'), 1.2),
	];

	return new Background(game, layers);
}

// Initialize function to start the game
const startGame = () => {
	const gameEngine = new GameEngine(ctx, assetManager)

	let player = new Goku(gameEngine, 100, 820, 3);
	gameEngine.player = player;

	gameEngine.addEntity(createBg(gameEngine), 100);

	gameEngine.addEntity(new Ground(gameEngine, -1000, 1000, 1))
	gameEngine.addEntity(player)
	gameEngine.addEntity(new Obstacle(gameEngine, 1700, 905, 0.15))
	gameEngine.addEntity(new Shuriken(gameEngine, 1700, 905, 0.075))
	gameEngine.addEntity(new BoxObstacle(gameEngine, 700, 905, 5))
	gameEngine.addEntity(new BoxObstacle(gameEngine, 700 + 90, 905, 5))
	gameEngine.addEntity(new BoxObstacle(gameEngine, 700 + 90, 905 - 90, 5))
	gameEngine.addEntity(new BoxObstacle(gameEngine, 700 + 90 * 2, 905, 5))
	gameEngine.addEntity(new BoxObstacle(gameEngine, 700 + 90 * 2, 905 - 90, 5))
	gameEngine.addEntity(new BoxObstacle(gameEngine, 700 + 90 * 2, 905 - 90 * 2, 5))

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
	assetManager.queueDownload('assets/shuriken/shuriken.png')

	assetManager.queueDownload('assets/boxes_barrels.png')

	assetManager.queueDownload('assets/bg/hills/layer_01.png');
	assetManager.queueDownload('assets/bg/hills/layer_02.png');
	assetManager.queueDownload('assets/bg/hills/layer_03.png');
	assetManager.queueDownload('assets/bg/hills/layer_04.png');
	assetManager.queueDownload('assets/bg/hills/layer_05.png');
	assetManager.queueDownload('assets/bg/hills/layer_06.png');

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