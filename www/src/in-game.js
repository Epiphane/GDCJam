function InGame() {
    // Initial variables
    this.speed = 10;
    this.p1Score = 0;
    this.p2Score = 0;
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

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function() {
    if (this.countdown) {
        var thisTime = new Date();
        var dt = thisTime - this.lastTime
        this.lastTime = thisTime;

        this.countdown -= dt;

        if (this.countdown <= 0) {
            this.countdown = 0;
            this.pause = false;
        }
    }

    if (this.pause)
        return;

    if (keyDown[KEYS.UP] && this.player2.getY() >= 0) {
        this.player2.accelerate(-this.speed);
    }
    if (keyDown[KEYS.DOWN] && this.player2.getY() + this.player2.getHeight() <= canvas.height) {
        this.player2.accelerate(this.speed);
    }

    if (keyDown[KEYS.W] && this.player1.getY() >= 0) {
        this.player1.accelerate(-this.speed);
    }
    if (keyDown[KEYS.S] && this.player1.getY() + this.player1.getHeight() <= canvas.height) {
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

            context.fillStyle = "rgba(255, 255, 255, " + 3 * timeToNext * (1 - timeToNext) + ")";
            context.font = fontSize + "pt Arial Black";
            var textSize = context.measureText(text);
            context.fillText(text, (canvas.width / 2) - (textSize.width / 2),
                                   (canvas.height / 2) + fontSize / 2);
        }
    }
};
