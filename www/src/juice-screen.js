function JuiceItScreen(game) {
   this.TOTAL_TIME = 4;

   this.inGame = game;
}

JuiceItScreen.prototype.init = function() {
   this.time = 0;

   this.juiceIt = renderText('ADDING JUICE', '72pt Arial Black', 'white');

   this.spinning = [
      { x: 100, y: 100, w: 50, h: 50 },
      { x: 250, y: 120, w: 10, h: 70 },
      { x: 400, y: 90, w: 40, h: 50 },
      { x: 550, y: 150, w: 10, h: 60 },
      { x: 700, y: 100, w: 10, h: 100 },
      { x: 850, y: 130, w: 40, h: 30 }
   ];
};

JuiceItScreen.prototype.update = function(dt) {
   this.time += dt;

   if (this.time >= this.TOTAL_TIME) {
      this.game.setState(this.inGame);
   }
};

JuiceItScreen.prototype.render = function(context) {
   if (Math.floor(this.time * 6) % 2 === 0) {
      context.fillStyle = 'rgb(166, 152, 77)';
   }
   else {
      context.fillStyle = 'rgb(30, 30, 30)';
   }
   context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

   context.drawImage(this.juiceIt, 
                     GAME_WIDTH / 2 - this.juiceIt.width / 2,
                     GAME_HEIGHT / 2 - this.juiceIt.height / 2);

   for(var i = 0; i < this.spinning.length; i ++) {
      var item = this.spinning[i];

      context.save();
      context.translate(item.x, item.y);
      context.rotate(this.time * 3);

      context.fillStyle = item.style || 'rgb(0, 0, 0)';
      context.fillRect(item.w / -2, item.h / -2, item.w, item.h);

      context.restore();
   }
};