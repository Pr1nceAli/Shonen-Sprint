class Goku extends Entity {
    constructor(game) {
        super();

        this.game = game;

        this.idle_animator = new Animator(ASSET_MANAGER.getAsset("./Assets/goku_sprites.png"),
         620, 120, 42, 60, 2, 0.45);

        this.run_animator = new Animator(ASSET_MANAGER.getAsset("./Assets/goku_sprites.png"),
         236, 272, 46, 60, 4, 0.15);
         
        this.jump_animator = new Animator(ASSET_MANAGER.getAsset("./Assets/goku_jump.png"),
         5, 0, 36, 64, 4, .25); 

         this.x = 100;
         this.y = 820; // Ground level
         this.speed = 520;
         this.velocity = 0;
         this.isJumping = false;
         this.jumpVelocity = 0;
         this.gravity = 1500; 
         this.initialJumpVelocity = -800; // Higher jump
     };
 
     update() {
         this.velocity = 0;
         
         if (this.game.keys['d'] === true) {
             this.velocity = 1;
         } else if (this.game.keys['a'] === true) {
             this.velocity = -1;
         } 
         
         this.x += this.velocity * this.speed * this.game.clockTick;
         
         if (this.game.keys['w'] === true && !this.isJumping) {
             this.isJumping = true;
             this.jumpVelocity = this.initialJumpVelocity;
         }
         
         if (this.isJumping) {
             this.y += this.jumpVelocity * this.game.clockTick;
             this.jumpVelocity += this.gravity * this.game.clockTick; 
             
             if (this.y >= 820) { // Reset when landing
                 this.y = 820;
                 this.isJumping = false;
             }
         }
     };
 
     draw(ctx) {
         if (this.isJumping) {
             this.jump_animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
         } else if (this.velocity === 0) {
             this.idle_animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
         } else {
             this.run_animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
         }
     };
    
}