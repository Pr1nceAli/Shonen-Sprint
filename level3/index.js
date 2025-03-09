import gameProperties from '../classes/gameProperties.js'
import AssetManager from '../classes/AssetManager.js'
import GameEngine from '../classes/GameEngine.js'
import Naruto from '../classes/Naruto.js'
import Obstacle from '../classes/Obstacle.js'
import Buu from '../classes/Buu.js'
import Shuriken from '../classes/Shuriken.js'
import BoxObstacle from '../classes/BoxObstacle.js'
import Ground from '../classes/Ground.js'
import {Background, BackgroundLayer} from '../classes/Background.js'
import HUD from '../classes/HUD.js'
import CarObstacle from '../classes/CarObstacle.js'
import Bin1Obstacle from '../classes/Bin1Obstacle.js'
import Bin2Obstacle from '../classes/Bin2Obstacle.js'
import Bin3Obstacle from '../classes/Bin3Obstacle.js'
import Lvl3Chaser from '../classes/Lvl3Chaser.js'
import TruckObstacle from '../classes/TruckObstacle.js'
import Portal from '../classes/Portal.js'

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
		new BackgroundLayer(game.assetManager.getAsset('../assets/lvl3/bg/1.png'), .1),
		new BackgroundLayer(game.assetManager.getAsset('../assets/lvl3/bg/2.png'), .5),
		new BackgroundLayer(game.assetManager.getAsset('../assets/lvl3/bg/3.png'), 1)
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
	
	assetManager.queueDownload('../assets/lvl3/naruto.png')
	assetManager.queueDownload('../assets/lvl3/chaser.png')
	assetManager.queueDownload('../assets/goku/obstacle.png')
	assetManager.queueDownload('../assets/buu/buu.png')
	assetManager.queueDownload('../assets/shuriken/shuriken.png')

	assetManager.queueDownload('../assets/boxes_barrels.png')
	assetManager.queueDownload('../assets/lvl3/car.png')
	assetManager.queueDownload('../assets/lvl3/truck.png')
	assetManager.queueDownload('../assets/lvl3/bins.png')
	assetManager.queueDownload('../assets/portal.png')

	assetManager.queueDownload('../assets/lvl3/bg/1.png')
	assetManager.queueDownload('../assets/lvl3/bg/2.png')
	assetManager.queueDownload('../assets/lvl3/bg/3.png')

	// Download assets and start the game
	assetManager.downloadAll(loadGame)
}

// Initialize function to load the game
const loadGame = () => {
	gameEngine = new GameEngine(ctx, assetManager)

	// let player = new Naruto(gameEngine, 100, 820, 3)
	let player = new Naruto(gameEngine, 100, 820, 3)
	let pursuer = new Lvl3Chaser(gameEngine, -250, 850, 0.3)

	player.pursuer = pursuer
	pursuer.target = player

	gameEngine.player = player

	gameEngine.addEntity(createBg(gameEngine), 100)

	gameEngine.addEntity(new Ground(gameEngine, -1000, 1000, 1))
	gameEngine.addEntity(player)
	gameEngine.addEntity(new HUD(gameEngine))

	createObstacles(gameEngine);

	gameEngine.addEntity(new Portal(gameEngine, 13000, 600, 7, "/win.html"))

	setTimeout(()=>{gameEngine.addEntity(pursuer)}, 1000)

	gameEngine.renderInit()

	// startGame() // remove
}

const startGame = () => {
	document.body.querySelector('main')?.remove()
	ctx.canvas.focus()
	document.body.onkeydown = null

	const audioEl = document.querySelector('audio')
	audioEl?.play()

	gameEngine.start()
	// spawnObstacle(gameEngine)
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