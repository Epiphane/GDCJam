function InGame() {
    // Initial variables
    this.speed = 10;
    this.p1Score = 0;
    this.p2Score = 0;

    this.experience = [0, 0];
}

InGame.prototype.init = function() {
    var distFromEdge = 20;
    var initialSize = { w: 20, h: 140 };
    var ballSize = 20;

    // "Entities"
    this.player1 = new Paddle(distFromEdge, canvas.height / 2, initialSize.w, initialSize.h);
    this.player2 = new Paddle(canvas.width - distFromEdge, canvas.height / 2, initialSize.w, initialSize.h);
    this.ball = new Ball(canvas.width / 2 - ballSize / 2,
                         canvas.height / 2 - ballSize / 2,
                         ballSize, 10);

    this.pause = true;
    this.countdown = 4000;
    this.lastTime = new Date();
};

InGame.prototype.giveExperience = function(player) {
    this.experience[player] += 10;
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function() {

    if (this.countdown) {
        var thisTime = new Date();
        var dt = thisTime - this.lastTime;
        this.lastTime = thisTime;

        this.countdown -= dt;

        if (this.countdown <= 0) {
            this.countdown = 0;
            this.pause = false;
        }
    }

    if (this.pause) {
        return;
    }

    if (keyDown[KEYS.UP]) {
        this.player2.accelerate(-this.speed);
    }
    if (keyDown[KEYS.DOWN]) {
        this.player2.accelerate(this.speed);
    }

    if (keyDown[KEYS.W]) {
        this.player1.accelerate(-this.speed);
    }
    if (keyDown[KEYS.S]) {
        this.player1.accelerate(this.speed);
    }

    this.player1.update();
    this.player2.update();
    this.ball.update(this);

    if (this.ball.win) {
        if (this.ball.win === 1) {
            this.p1Score++;
        }
        else {
            this.p2Score++;
        }
        this.pause = true;
        this.init();
    }
};

InGame.prototype.draw = function(context) {
    var scores = this.p1Score.toString() + "   " + this.p2Score.toString();

    context.fillStyle = "white";
    context.font = "50px Poiret One";
    var scoreWidth = context.measureText(scores).width;
    context.fillText(scores, (canvas.width / 2) - (scoreWidth / 2), 50);

    var grd = context.createLinearGradient(0.000, 150.000, canvas.width / 2 - 100, 150.000);
      
    // Add colors
    grd.addColorStop(0.000, 'rgba(0, 255, 0, 1.000)');
    grd.addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
    grd.addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
    grd.addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');

    // Fill with gradient
    context.fillStyle = grd;

    var padding = 20;
    var expBarWidth = canvas.width / 2 - (2 * padding + 50);
    // context.fillStyle = "rgb(255, 100, 100)";
    context.fillRect(padding, padding, expBarWidth * this.experience[0] / 100, padding * 2);

    var grd = context.createLinearGradient(canvas.width / 2 + 100, 150.000, canvas.width, 150.000);
      
    // Add colors
    grd.addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
    grd.addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
    grd.addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
    grd.addColorStop(1.000, 'rgba(0, 255, 0, 1.000)');

    // Fill with gradient
    context.fillStyle = grd;

    var p2Width = expBarWidth * this.experience[1] / 100;
    context.fillRect(canvas.width - padding - p2Width, padding, p2Width, padding * 2);

    this.player1.draw(context);
    this.player2.draw(context);

    this.ball.draw(context);

    if (this.countdown > 200) {
        if (this.countdown < 4000) {
            var text;
            if (this.countdown > 1000)
                text = Math.floor(this.countdown / 1000).toString();
            else
                text = 'GO!';

            var timeToNext = (this.countdown % 1000) / 1000;
            var maxSize = 1000;
            var fontSize = maxSize - maxSize * timeToNext;

            context.fillStyle = "rgba(255, 255, 255, " + 2 * timeToNext * (1 - timeToNext) + ")";
            context.font = fontSize + "pt Arial Black";
            var textSize = context.measureText(text);
            context.fillText(text, (canvas.width / 2) - (textSize.width / 2),
                                   (canvas.height / 2) + fontSize / 2);
        }
    }
};
