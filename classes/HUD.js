import Entity from './Entity.js'
class HUD extends Entity {
    constructor(game) {
        super(game, 0,0,1,false);
        this.game = game;
    }

    update() {}

    draw(ctx) { 
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(10, 10, 300, 50);

        // Draw distance text
        ctx.fillStyle = "white";
        ctx.font = "35px Arial";
        ctx.fillText(`Distance: ${Math.floor(this.game.player.distanceTraveled)}m`, 20, 40);}
}

export default HUD;