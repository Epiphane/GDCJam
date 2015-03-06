function ReadyScreen() {
   this.inGame = new InGame();

   this.ARROW_RISE_SPEED = 2;
   this.ARROW_READY_TIME = 100;
}

ReadyScreen.prototype.init = function() {
   this.ready = [false, false];
   this.arrowHeight = [0, 0];
   this.up = [chooseUP, chooseUP2];
   this.upRev = [chooseUPREV, chooseUPREV2];
   this.down = [chooseDOWN, chooseDOWN2];
   this.downRev = [chooseDOWNREV, chooseDOWNREV2];

   this.floatOffset = 0;
   this.delay = 50;

   this.labels = [
      renderText('[ W ]', '30pt Arial', 'white'),
      renderText('[ UP ]', '30pt Arial', 'white'),
      renderText('Ready?', '30pt Arial', 'white'),
      renderText('Ready?', '30pt Arial', 'white')
   ];

   this.fadeArrows = [];
};

ReadyScreen.prototype.createFadeArrow = function(x, y, flipped) {
    this.fadeArrows.push( {x: x, y: y, scale: 1, alpha: 0.8, flipped: flipped } );
}

ReadyScreen.prototype.update = function(dt) {
   this.floatOffset += 2 * dt;

   for (var player = 0; player <= 1; player ++) {
      if (!this.ready[player]) {
         // Rise or lower arrow
         if (InputManager.control(player, CONTROLS.UP)) {
            this.arrowHeight[player] += this.ARROW_RISE_SPEED;
            this.down[player].stop();
            this.downRev[player].stop();
            this.upRev[player].stop();
            this.up[player].play();
         }
         else {
            this.arrowHeight[player] *= 0.8;
            if (this.up[player].getPercent() > 0) {
               this.upRev[player].play();
               this.upRev[player].setPercent(120 - this.down[player].getPercent());
            }

            if (this.down[player].getPercent() > 0) {
               this.downRev[player].play();
               this.downRev[player].setPercent(120 - this.down[player].getPercent());
            }

            this.up[player].stop();
            this.down[player].stop();
         }

         // Am I ready??
         if (this.arrowHeight[player] >= this.ARROW_READY_TIME) {
            this.ready[player] = true;
            readySound.play();
            this.up[player].stop();
            if (player === 0) {
               this.createFadeArrow(ARROW_MARGIN, 80, 1);               
            }
            else {
               this.createFadeArrow(GAME_WIDTH - ARROW_MARGIN, 80, 1);
            }
         }
      }
   }

   if (this.ready[0] && this.ready[1] && --this.delay <= 0) {
      this.game.setState(this.inGame);
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

ReadyScreen.prototype.render = function(context) {
   this.inGame.render(context);

   var readyGradient = context.createLinearGradient(150.000, 0.000, 150.000, 300.000);
   readyGradient.addColorStop(0.000, 'rgba(33, 127, 7, 1.000)');
   readyGradient.addColorStop(0.994, 'rgba(0, 255, 0, 1.000)');

   var p1Fill = this.arrowHeight[0] / this.ARROW_READY_TIME;
   context.drawArrow(ARROW_MARGIN, p1Fill, 1, 1, readyGradient, "white");

   var p2Fill = this.arrowHeight[1] / this.ARROW_READY_TIME;
   context.drawArrow(GAME_WIDTH - ARROW_MARGIN, p2Fill, 1, 1, readyGradient, "white");

   // Draw "Ready?"
   context.drawImage(this.labels[2], ARROW_MARGIN - this.labels[2].width / 2, 140 + Math.sin(this.floatOffset) * 15);
   context.drawImage(this.labels[3], GAME_WIDTH - ARROW_MARGIN - this.labels[3].width / 2, 140 + Math.sin(this.floatOffset) * 15);

   // Draw controls
   context.drawImage(this.labels[0], ARROW_MARGIN - this.labels[0].width / 2, 450);
   context.drawImage(this.labels[1], GAME_WIDTH - ARROW_MARGIN - this.labels[1].width / 2, 450);
    
    // Draw fade arrows as necessary
    for (var ndx = 0; ndx < this.fadeArrows.length; ndx++) {
        var currArrow = this.fadeArrows[ndx];
        context.drawArrow(currArrow.x, 2, 1, currArrow.flipped, "rgba(255, 255, 255, " + currArrow.alpha + ")", "rgba(0, 0, 0, 0)", currArrow.scale);
    }
};