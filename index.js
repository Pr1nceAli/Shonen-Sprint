import AssetManager from './classes/AssetManager.js'
import GameEngine from './GameEngine.js'
import Goku from './Goku.js'
import { BackgroundLayer, Background } from './classes/Background.js'

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

const ASSET_MANAGER = new AssetManager()


const createBg = (game) => {
	let layers = [
		new BackgroundLayer(ASSET_MANAGER.getAsset('./Assets/bg/hills/layer_01.png'), .2),
		new BackgroundLayer(ASSET_MANAGER.getAsset('./Assets/bg/hills/layer_02.png'), .5),
		new BackgroundLayer(ASSET_MANAGER.getAsset('./Assets/bg/hills/layer_03.png'), .75),
		new BackgroundLayer(ASSET_MANAGER.getAsset('./Assets/bg/hills/layer_04.png'), 1),
		new BackgroundLayer(ASSET_MANAGER.getAsset('./Assets/bg/hills/layer_05.png'), 2),
		new BackgroundLayer(ASSET_MANAGER.getAsset('./Assets/bg/hills/layer_06.png'), 3),
	];

	return new Background(game, layers);
}

const startGame = () => {
	// Initialize the game engine
	const gameEngine = new GameEngine(ctx)

	let player = new Goku(gameEngine);
	gameEngine.player = player;

	// Add entities to the game engine
	gameEngine.addEntity(player)
	gameEngine.addEntity(createBg(gameEngine));

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

	// Load assets
	ASSET_MANAGER.queueDownload('./Assets/goku running.png')
	ASSET_MANAGER.queueDownload('./Assets/goku_jump.png')
	ASSET_MANAGER.queueDownload('./Assets/goku_sprites.png')

	// load bg
	ASSET_MANAGER.queueDownload('./Assets/bg/hills/layer_01.png');
	ASSET_MANAGER.queueDownload('./Assets/bg/hills/layer_02.png');
	ASSET_MANAGER.queueDownload('./Assets/bg/hills/layer_03.png');
	ASSET_MANAGER.queueDownload('./Assets/bg/hills/layer_04.png');
	ASSET_MANAGER.queueDownload('./Assets/bg/hills/layer_05.png');
	ASSET_MANAGER.queueDownload('./Assets/bg/hills/layer_06.png');

	// Download assets and start the game
	ASSET_MANAGER.downloadAll(startGame)
}

// Set canvas and its context to variable
const canvas = document.querySelector('canvas')
const ctx = canvas?.getContext('2d')

if (ctx instanceof CanvasRenderingContext2D) {
	initGame()
}

export {ASSET_MANAGER}