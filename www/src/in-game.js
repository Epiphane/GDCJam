function InGame() {
    // Initial variables
    this.speed = 8;
    this.p1Score = 0;
    this.p2Score = 0;
    this.pause = false;
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
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function() {
    var p1Moved = false;
    var p2Moved = false;

    if (this.pause) {
        if (keyDown[KEYS.SPACE]) {
            this.pause = false;
        }
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
    var scoreWidth = context.measureText(scores).width;

    context.fillStyle = "white";
    context.font = "50px Courier";
    context.fillText(scores, (canvas.width / 2) - (scoreWidth / 2), 50);
    this.player1.draw(context);
    this.player2.draw(context);

    this.ball.draw(context);
};
