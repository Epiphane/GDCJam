function GameOverScreen(winner) {
   this.particles = [];
   this.TIME_PER_CARD = 3;
   this.TIME_PER_NEW_CARD = 24;

   this.stopClear = true;

   this.cwidth = winner.getWidth();
   this.cheight = winner.getHeight();

   this.alpha = 2.5;

   var direction = (winner.player === 0) ? 1 : -1;
   this.addCard(winner.getX() + winner.getWidth() / 2,
                winner.getY(), 
                direction);
}

GameOverScreen.prototype.init = function() {
   this.cardFrame = this.TIME_PER_NEW_CARD;
};

GameOverScreen.prototype.update = function(dt) {
   if (InputManager.keyDown(KEYS.SPACE))
      this.game.setState(new TitleScreen());

   if (this.cardFrame-- <= 0) {
      this.cardFrame = this.TIME_PER_NEW_CARD;

      if (this.particles.length > 52)
         return;

      this.addCard(Math.random() * GAME_WIDTH, 
                   Math.random() / 2 * GAME_HEIGHT, 
                   (Math.random() > 0.5) ? 1 : -1);
   }

   if (this.cardFrame % this.TIME_PER_CARD === 0) {
      for (var l = 0; l < this.particles.length; l ++) {
         this.particles[l].update(dt);
      }

      this.alpha *= 0.99;
   }

   if (this.alpha < 0.05) {
      if (this.particles.length > 0 && Math.random() < 0.3) {
         this.particles.splice(0, 1);

         if (this.particles.length === 0)
            this.game.setState(new TitleScreen());
      }
   }
};

GameOverScreen.prototype.addCard = function(x, y, direction) {
   var card = Math.floor(Math.random() * 52);

   var particle = new Particle(card, x, y + this.cheight / 2, 
                               direction * 4, - Math.random() * 8, 
                               this.cwidth, this.cheight);

   this.particles.push(particle);
};

GameOverScreen.prototype.render = function(context) {
   for (var l = 0; l < this.particles.length; l ++) {
      this.particles[l].draw(context, (this.alpha > 1 ? 1 : this.alpha));
   }

   if (this.alpha < 0.05) {
      context.fillStyle = "rgba(0, 0, 0, 0.1)";
      context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
   }
};