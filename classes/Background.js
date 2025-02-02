import Entity from "../Entity.js";

class BackgroundLayer {
    constructor(image, speed) {
        this.image = image;
        this.speed = speed;
        this.x = 0;
    }

    update(playerX, ctx) {
        this.x = -playerX * this.speed % ctx.canvas.width;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, 0, ctx.canvas.width, ctx.canvas.height);

        if (this.x < 0) {
            ctx.drawImage(this.image, this.x + ctx.canvas.width, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }
}

class Background extends Entity {
    constructor(game, layers) {
        super();
        
        this.game = game;
        this.layers = layers;
    }

    update() {
        this.layers.forEach(layer => layer.update(this.game.player.x, this.game.ctx));
    }

    draw(ctx) {
        this.layers.forEach(layer => {
            // ctx.drawImage(layer.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
            layer.draw(ctx);
        });
    }
}

export {BackgroundLayer, Background}