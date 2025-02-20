import Entity from "./Entity.js";

class Camera {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
    }

    getWidth() {
        return this.game.ctx.canvas.width;
    }

    getHeight() {
        return this.game.ctx.canvas.height;
    }

    getScreenPosition(entity) {
        return [entity.x - this.x, entity.y - this.y];
    }
}

export default Camera