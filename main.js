
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./Assets/goku running.png");
ASSET_MANAGER.queueDownload("./Assets/goku_jump.png");
ASSET_MANAGER.queueDownload("./Assets/goku_sprites.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("game");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	const gameEngine = new GameEngine(ctx);

	gameEngine.addEntity(new Goku(gameEngine));

	gameEngine.start();
});
