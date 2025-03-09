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
import Isbou1 from '../classes/Isbou1.js'
import Isbou2 from '../classes/Isbou2.js'
import Isbou3 from '../classes/Isbou3.js'
import Konan from '../classes/Konan.js'
import Sasori from '../classes/Sasori.js'
import Puppet from '../classes/Puppet.js'
import Pain from '../classes/Pain.js'
import Rock from '../classes/Rock.js'
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
		new BackgroundLayer(game.assetManager.getAsset('../assets/gojo/cyberpunk-street-files/Layers/back.png'), .1),
		new BackgroundLayer(game.assetManager.getAsset('../assets/gojo/cyberpunk-street-files/Layers/buildings.png'), .5),
		new BackgroundLayer(game.assetManager.getAsset('../assets/gojo/cyberpunk-street-files/Layers/front.png'), 1)
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
	const iso1 = (x, y = 830) => gameEngine.addEntity(new Isbou1(gameEngine, x, y, .8));
	const iso2 = (x, y = 850) => gameEngine.addEntity(new Isbou2(gameEngine, x, y, .8));
	const iso3 = (x, y = 825) => gameEngine.addEntity(new Isbou3(gameEngine, x, y, .8));
	const konan = (x, y = 810) => gameEngine.addEntity(new Konan(gameEngine, x, y, 1.5));
	const pain = (x, y = 855) => gameEngine.addEntity(new Pain(gameEngine, x, y, 1.1));
	const sasori = (x, y = 865  ) => gameEngine.addEntity(new Sasori(gameEngine, x, y, 1.5));
	const puppet = (x, y = 730) => gameEngine.addEntity(new Puppet(gameEngine, x, y, 1.5));
	const rock = (x, y = 855) => gameEngine.addEntity(new Rock(gameEngine, x, y, 1));


	iso1(1000);
	sasori(2000);
	puppet(2400);
	iso2(3000);
	rock(3750); //truck(4000);
	iso3(5000);
	sasori(6000);
	puppet(6400);
	konan(7000); //truck(7000);
	iso1(8000);
	rock(9000);
	iso2(9800); 
	konan(10400);
	rock(10800);
	rock(11200);
	iso1(11600);
	pain(12400); //truck(11000);
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
	assetManager.queueDownload('../assets/naruto/isbou 1.png')
	assetManager.queueDownload('../assets/naruto/isbou 2.png')
	assetManager.queueDownload('../assets/naruto/isbou 3.png')
	assetManager.queueDownload('../assets/naruto/rock.png')
	assetManager.queueDownload('../assets/naruto/konan.png')
	assetManager.queueDownload('../assets/naruto/pain.png')
	assetManager.queueDownload('../assets/naruto/sasori.png')
	assetManager.queueDownload('../assets/naruto/puppet.png')
	assetManager.queueDownload('../assets/portal.png')

	assetManager.queueDownload('../assets/gojo/cyberpunk-street-files/Layers/back.png')
	assetManager.queueDownload('../assets/gojo/cyberpunk-street-files/Layers/buildings.png')
	assetManager.queueDownload('../assets/gojo/cyberpunk-street-files/Layers/front.png')

	// Download assets and start the game
	assetManager.downloadAll(loadGame)

	document.getElementById("music").volume = 0.1;
}

// Initialize function to load the game
const loadGame = () => {
	gameEngine = new GameEngine(ctx, assetManager)

	// let player = new Naruto(gameEngine, 100, 820, 3)
	let player = new Naruto(gameEngine, 100, 900, 3)
	let pursuer = new Lvl3Chaser(gameEngine, -250, 850, 0.3)

	player.pursuer = pursuer
	pursuer.target = player

	gameEngine.player = player

	gameEngine.addEntity(createBg(gameEngine), 100)
	gameEngine.addEntity(new Ground(gameEngine, -1000,1000, 1))
	gameEngine.addEntity(player)
	gameEngine.addEntity(new HUD(gameEngine))

	

	gameEngine.addEntity(new Portal(gameEngine, 13000, 600, 7, "/win.html"))
	
	createObstacles(gameEngine);

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