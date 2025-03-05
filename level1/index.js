import gameProperties from '../classes/gameProperties.js'
import AssetManager from '../classes/AssetManager.js'
import GameEngine from '../classes/GameEngine.js'
import Goku from '../classes/Goku.js'
import Obstacle from '../classes/Obstacle.js'
import Buu from '../classes/Buu.js'
import Shuriken from '../classes/Shuriken.js'
import BoxObstacle from '../classes/BoxObstacle.js'
import Ground from '../classes/Ground.js'
import {Background, BackgroundLayer} from '../classes/Background.js'
import HUD from '../classes/HUD.js'

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
		new BackgroundLayer(game.assetManager.getAsset('../assets/bg/hills/layer_01.png'), .2),
		new BackgroundLayer(game.assetManager.getAsset('../assets/bg/hills/layer_02.png'), .5),
		new BackgroundLayer(game.assetManager.getAsset('../assets/bg/hills/layer_03.png'), .75),
		new BackgroundLayer(game.assetManager.getAsset('../assets/bg/hills/layer_04.png'), 1),
		new BackgroundLayer(game.assetManager.getAsset('../assets/bg/hills/layer_05.png'), 1),
		new BackgroundLayer(game.assetManager.getAsset('../assets/bg/hills/layer_06.png'), 1.2),
	]

	return new Background(game, layers)
}

const spawnObstacle = (gameEngine) => {
    const minSpawnTime = 2000;
    const maxSpawnTime = 3000;

    const boxWidth = 90;
    const groundY = 905;
    const stairHeight = 3;
    const spawnRange = 300; // Max extra space in front of player

    const spawn = () => {
        let randomX;
        let isOverlapping;
        
        do {
            randomX = gameEngine.player.x + 800 + Math.random() * spawnRange;
            isOverlapping = gameEngine.entities.some(entity => 
                entity instanceof BoxObstacle && 
                Math.abs(entity.x - randomX) < boxWidth // Check if too close
            );
        } while (isOverlapping); // Keep generating until we find a free space

        const stackHeight = Math.floor(Math.random() * stairHeight) + 1;
        const isStairShape = Math.random() > 0.25;

        if (isStairShape) {
            for (let i = 0; i < stairHeight; i++) {
                for (let j = 0; j <= i; j++) {
                    let boxX = randomX + i * boxWidth;
                    let boxY = groundY - j * boxWidth;
                    let obstacle = new BoxObstacle(gameEngine, boxX, boxY, 5);
                    gameEngine.addEntity(obstacle);
                }
            }
        } else {
            for (let i = 0; i < stackHeight; i++) {
                let boxY = groundY - i * boxWidth;
                let obstacle = new BoxObstacle(gameEngine, randomX, boxY, 5);
                gameEngine.addEntity(obstacle);
            }
        }

        const nextSpawnTime = Math.random() * (maxSpawnTime - minSpawnTime) + minSpawnTime;
        setTimeout(spawn, nextSpawnTime);
    };

    spawn();
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
	
	assetManager.queueDownload('../assets/goku/sprites.png')
	assetManager.queueDownload('../assets/goku/running.png')
	assetManager.queueDownload('../assets/goku/jumping.png')
	assetManager.queueDownload('../assets/goku/obstacle.png')
	assetManager.queueDownload('../assets/buu/buu.png')
	assetManager.queueDownload('../assets/shuriken/shuriken.png')

	assetManager.queueDownload('../assets/boxes_barrels.png')

	assetManager.queueDownload('../assets/bg/hills/layer_01.png')
	assetManager.queueDownload('../assets/bg/hills/layer_02.png')
	assetManager.queueDownload('../assets/bg/hills/layer_03.png')
	assetManager.queueDownload('../assets/bg/hills/layer_04.png')
	assetManager.queueDownload('../assets/bg/hills/layer_05.png')
	assetManager.queueDownload('../assets/bg/hills/layer_06.png')

	// Download assets and start the game
	assetManager.downloadAll(loadGame)
}

// Initialize function to load the game
const loadGame = () => {
	gameEngine = new GameEngine(ctx, assetManager)

	let player = new Goku(gameEngine, 100, 820, 3)
	let pursuer = new Buu(gameEngine, -250, 875, 0.3)

	player.pursuer = pursuer
	pursuer.target = player

	gameEngine.player = player

	gameEngine.addEntity(createBg(gameEngine), 100)

	gameEngine.addEntity(new Ground(gameEngine, -1000, 1000, 1))
	gameEngine.addEntity(player)
	gameEngine.addEntity(new Obstacle(gameEngine, 1700, 500, 0.15))
	gameEngine.addEntity(new Shuriken(gameEngine, 1700, 905, 0.075))
	gameEngine.addEntity(new HUD(gameEngine))
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
	spawnObstacle(gameEngine)
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