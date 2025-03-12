import gameProperties from '../classes/gameProperties.js'
import AssetManager from '../classes/AssetManager.js'
import GameEngine from '../classes/GameEngine.js'
import Obstacle from '../classes/Obstacle.js'
import BoxObstacle from '../classes/BoxObstacle.js'
import Ground from '../classes/Ground.js'
import {Background, BackgroundLayer} from '../classes/Background.js'
import HUD from '../classes/HUD.js'
import Gojo from '../classes/Gojo.js'
import Toji from '../classes/Toji.js'
import Portal from '../classes/Portal.js'
import Bin1Obstacle from '../classes/Bin1Obstacle.js'
import Bin2Obstacle from '../classes/Bin2Obstacle.js'
import Bin3Obstacle from '../classes/Bin3Obstacle.js'
import TruckObstacle from '../classes/TruckObstacle.js'
import CarObstacle from '../classes/CarObstacle.js'


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
		new BackgroundLayer(game.assetManager.getAsset('../assets/gojo/SynthCitiesGodot/CityLayers/back.png'), .2),
		new BackgroundLayer(game.assetManager.getAsset('../assets/gojo/SynthCitiesGodot/CityLayers/middle.png'), .5),
		new BackgroundLayer(game.assetManager.getAsset('../assets/gojo/SynthCitiesGodot/CityLayers/foreground.png'), .75)
	]

	return new Background(game, layers)
}

const createObstacles = (gameEngine) => {
	const bin1 = (x, y = 850) => gameEngine.addEntity(new Bin1Obstacle(gameEngine, x, y, .75));
	const bin2 = (x, y = 850) => gameEngine.addEntity(new Bin2Obstacle(gameEngine, x, y, 1));
	const bin3 = (x, y = 850) => gameEngine.addEntity(new Bin3Obstacle(gameEngine, x, y, .75));
	const car = (x, y = 850) => gameEngine.addEntity(new CarObstacle(gameEngine, x, y, 1));
	const truck = (x, y = 750) => gameEngine.addEntity(new TruckObstacle(gameEngine, x, y, 2));


	car(1000);
	bin3(2000);
	bin1(3000);
	bin2(3750); //truck(4000);
	car(5000);
	bin2(6000);
	bin1(6850); //truck(7000);
	car(8000);
	bin3(9000);
	bin1(9800); car(10000);
	bin2(10800); //truck(11000);
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
	
	assetManager.queueDownload('../assets/gojo/Idle.png')
	assetManager.queueDownload('../assets/gojo/gojo walk.png')
	assetManager.queueDownload('../assets/gojo/gojo jump.png')
	assetManager.queueDownload('../assets/gojo/toji run.png')

	assetManager.queueDownload('../assets/boxes_barrels.png')
	assetManager.queueDownload('../assets/lvl3/car.png')
	assetManager.queueDownload('../assets/lvl3/truck.png')
	assetManager.queueDownload('../assets/lvl3/bins.png')
	assetManager.queueDownload('../assets/portal.png')

	assetManager.queueDownload('../assets/gojo/SynthCitiesGodot/CityLayers/back.png')
	assetManager.queueDownload('../assets/gojo/SynthCitiesGodot/CityLayers/foreground.png')
	assetManager.queueDownload('../assets/gojo/SynthCitiesGodot/CityLayers/middle.png')
	

	// Download assets and start the game
	assetManager.downloadAll(loadGame)
}

// Initialize function to load the game
const loadGame = () => {
	gameEngine = new GameEngine(ctx, assetManager)

	let player = new Gojo(gameEngine, 200, 820, 3)
	let pursuer = new Toji(gameEngine, -220, 780, 0.3)

	player.pursuer = pursuer
	pursuer.target = player

	gameEngine.player = player

	gameEngine.addEntity(createBg(gameEngine), 100)

	gameEngine.addEntity(new Ground(gameEngine, -1000, 1000, 1))
	gameEngine.addEntity(player)
	gameEngine.addEntity(new HUD(gameEngine))
	gameEngine.addEntity(new Portal(gameEngine, 13200, 600, 7, "../level3/index.html"))
	createObstacles(gameEngine);
	setTimeout(()=>{gameEngine.addEntity(pursuer)},1000)

	gameEngine.renderInit()
}

const startGame = () => {
	document.body.querySelector('main')?.remove()
	ctx.canvas.focus()
	document.body.onkeydown = null

	const audioEl = document.querySelector('audio')
	audioEl?.play()

	gameEngine.start()
	
}

// Set canvas and its context to variable
const canvas = document.querySelector('canvas')
const ctx = canvas?.getContext('2d')


// Initialize the asset manager and the game engine
const assetManager = new AssetManager()
let gameEngine

// If the context is a CanvasRenderingContext2D, initialize the game
if (ctx instanceof CanvasRenderingContext2D) {
	initGame()
}

document.body.onkeydown = (e) => {
	if (e.which === 32) {
		startGame()
	}
}