class Goku extends Entity {
    constructor(game) {
        super();

        this.game = game;

        this.idle_animator = new Animator(ASSET_MANAGER.getAsset("./Assets/goku_sprites.png"),
         620, 120, 42, 60, 2, 0.45);

        this.run_animator = new Animator(ASSET_MANAGER.getAsset("./Assets/goku_sprites.png"),
         236, 272, 46, 60, 4, 0.15);

         this.x = 100;
         this.y = 780;
         this.speed = 520;
         this.velocity = 0;
    };

    update() {
        this.velocity = 0;
        if (this.game.keys['d'] === true) {
            this.velocity = 1;
        } else if (this.game.keys['a'] === true) {
            this.velocity = -1;
        }

        this.x += this.velocity * this.speed * this.game.clockTick;
    };

    draw(ctx) {
        if (this.velocity === 0) {
            this.idle_animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
        else {
            this.run_animator.reverse = this.velocity < 0;
            this.run_animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);    
        }
    };
}