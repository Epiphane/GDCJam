function PowerupScreen(game, player, doAction) {
   this.ARROW_RISE_SPEED = 2;
   this.ARROW_CHOOSE_TIME = 100;

   this.inGame = game;
   this.player = player;
   this.doAction = doAction;

   this.baseX = (player === 0) ? ARROW_MARGIN : GAME_WIDTH - ARROW_MARGIN;
}

PowerupScreen.prototype.init = function() {
   this.opt1 = Powerup.getRandomPowerup(this.inGame.players[this.player]);
   this.opt2 = Powerup.getRandomPowerup(this.inGame.players[this.player], this.opt1);

   this.choice = 0;

   this.up = chooseUP;
   this.upRev = chooseUPREV;
   this.down = chooseDOWN;
   this.downRev = chooseDOWNREV;

   this.chosen = false;
   this.delay = 50;

   this.labels = [
      renderText(this.opt1.prototype.name, '42pt Poiret One', 'white'),
      renderText(this.opt2.prototype.name, '42pt Poiret One', 'white'),
   ];

   this.fadeArrows = [];
};

PowerupScreen.prototype.createFadeArrow = function(x, y, flipped) {
  this.fadeArrows.push( {x: x, y: y, scale: 1, alpha: 0.8, flipped: flipped } );
}

PowerupScreen.prototype.drawPowerupArrows = function() {
   var arrowX = 0;
   if (this.powerupChoices.length > 0) {
   }
}

PowerupScreen.prototype.update = function(dt) {
   if (this.chosen) {
      if (--this.delay < 0) {
         this.game.setState(this.inGame);
      }
   }
   else {
      if (InputManager.control(this.player, CONTROLS.UP)) {
         this.choice += this.ARROW_RISE_SPEED;
         this.down.stop();
         this.downRev.stop();
         this.upRev.stop();
         this.up.play();
      }
      else if (InputManager.control(this.player, CONTROLS.DOWN)) {
         this.choice -= this.ARROW_RISE_SPEED;
         this.up.stop();
         this.upRev.stop();
         this.downRev.stop();
         this.down.play();
      }
      else {
         this.choice *= 0.8;

         if (this.up.getPercent() > 0) {
            this.upRev.play();
            this.upRev.setPercent(120 - this.up.getPercent());
         }
         if (this.down.getPercent() > 0) {
            this.downRev.play();
            this.downRev.setPercent(120 - this.down.getPercent());
         }

         this.up.stop();
         this.down.stop();
      }

      if (this.choice > this.ARROW_CHOOSE_TIME) {
         this.up.stop();
         this.upRev.stop();
         this.down.stop();
         this.downRev.stop();

         this.createFadeArrow(this.baseX, 80, 1);

         var player = this.inGame.players[this.player];
         player.addPowerup(new this.opt1(this.inGame, player), this.baseX, 140, this.doAction);

         this.chosen = true;
      }
      else if (this.choice < -this.ARROW_CHOOSE_TIME) {
         this.up.stop();
         this.upRev.stop();
         this.down.stop();
         this.downRev.stop();

         this.createFadeArrow(this.baseX, 80, -1);

         var player = this.inGame.players[this.player];
         player.addPowerup(new this.opt2(this.inGame, player), this.baseX, GAME_HEIGHT - 140, this.doAction);
         
         this.chosen = true;
      }
   }

   // Fade the effect arrows if necessary
   for (var ndx = this.fadeArrows.length - 1; ndx >= 0; ndx--) {
      if (this.fadeArrows[ndx].scale < 0) {
         this.fadeArrows[ndx].scale -= 0.05;
      }
      else {
         this.fadeArrows[ndx].scale += 0.05;
      }
      this.fadeArrows[ndx].alpha -= 0.03;
      if (this.fadeArrows[ndx].alpha < 0) {
         this.fadeArrows.splice(ndx, 1);
      }
   }
};

PowerupScreen.prototype.render = function(context) {
   this.inGame.render(context);

   var arrowGradient = context.createLinearGradient(150.000, 0.000, 150.000, 300.000);
   arrowGradient.addColorStop(0.000, 'rgba(255, 255, 86, 1.000)');
   arrowGradient.addColorStop(1.000, 'rgba(127, 0, 127, 1.000)');

   var fillHeight = this.choice / this.ARROW_CHOOSE_TIME;

   if (fillHeight < 0) {
      context.drawArrow(this.baseX, -fillHeight, 1, -1, arrowGradient, "white");
      context.drawArrow(this.baseX, 0,           1,  1, arrowGradient, "white");
   }
   else {
      context.drawArrow(this.baseX, 0,           1, -1, arrowGradient, "white");
      context.drawArrow(this.baseX, fillHeight,  1,  1, arrowGradient, "white");
   }

   context.drawImage(this.labels[0], this.baseX - this.labels[0].width / 2, 140);
   context.drawImage(this.labels[1], this.baseX - this.labels[1].width / 2, GAME_HEIGHT - 140);

   // Draw fade arrows as necessary
   for (var ndx = 0; ndx < this.fadeArrows.length; ndx++) {
      var currArrow = this.fadeArrows[ndx];
      context.drawArrow(currArrow.x, 2, 1, currArrow.flipped, "rgba(255, 255, 255, " + currArrow.alpha + ")", "rgba(0, 0, 0, 0)", currArrow.scale);
   }
};