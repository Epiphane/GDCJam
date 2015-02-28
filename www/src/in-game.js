function InGame() {
    // Initial variables
    var distFromEdge = 20;
    var initialSize = { w: 20, h: 140 };
    var ballSize = 20;
    this.speed = 8;

    // "Entities"
    this.player1 = new Paddle(distFromEdge, canvas.height / 2, initialSize.w, initialSize.h);
    this.player2 = new Paddle(canvas.width - distFromEdge - initialSize.w, canvas.height / 2, initialSize.w, initialSize.h);
    this.ball = new Ball(canvas.width / 2 - ballSize / 2,
                         canvas.height / 2 - ballSize / 2,
                         ballSize, 10);
}

InGame.prototype.init = function() {
    // this.ball.update(this);
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function() {
    if (keyDown[KEYS.UP])
        this.player2.moveY(-this.speed);
    if (keyDown[KEYS.DOWN])
        this.player2.moveY(this.speed);

    if (keyDown[KEYS.W])
        this.player1.moveY(-this.speed);
    if (keyDown[KEYS.S])
        this.player1.moveY(this.speed);

    this.ball.update(this);
};

InGame.prototype.draw = function(context) {
    this.player1.draw(context);
    this.player2.draw(context);

    this.ball.draw(context);
};
