/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function Ball(x, y, radius, speed) {
    var direction = Math.random() > 0.5;
    var widthOfAngle = Math.PI / 2;
    var angle = Math.random() * widthOfAngle - widthOfAngle / 2;

    this.shape = new SAT.Circle(new SAT.Vector(x, y), radius);

    this.velocity = {
        x: speed * Math.cos(angle) * (direction ? 1 : -1),
        y: speed * Math.sin(angle),
    }
}

Ball.prototype.getX = function() { return this.shape.pos.x; };
Ball.prototype.getY = function() { return this.shape.pos.y; };
Ball.prototype.getSize = function() { return this.shape.r; };
Ball.prototype.moveX = function(dx) { this.shape.pos.x += dx; };
Ball.prototype.moveY = function(dy) { this.shape.pos.y += dy; };
Ball.prototype.setX = function(x) { this.shape.pos.x = x; };
Ball.prototype.setY = function(y) { this.shape.pos.y = y; };
Ball.prototype.setSize = function(r) { this.shape.r = r; };

Ball.prototype.update = function(game) {
    var flipY = function(off) {
        this.moveY(-2 * off);
        this.velocity.y *= -1;
    }.bind(this);

    this.moveX(this.velocity.x);
    this.moveY(this.velocity.y);

    if (this.getY() - this.getSize() <= 0) {
        flipY(this.getY() - this.getSize());
    }
    else if (this.getY() + this.getSize() >= canvas.height) {
        flipY(this.getY() + this.getSize() - canvas.height);
    }

    // Check for paddle collisions
    var collision = new SAT.Response();
    // Player 1
    if (SAT.testPolygonCircle(game.player1.shape, this.shape, collision)) {
        this.shape.pos.x += collision.overlapV.x * 2;
        if (collision.overlapV.x)
            this.velocity.x *= -1;

        this.shape.pos.y += collision.overlapV.y * 2;
        if (collision.overlapV.y)
            this.velocity.y *= -1;
    }

    // Player 2
    if (SAT.testPolygonCircle(game.player2.shape, this.shape, collision)) {
        if (collision.overlapV.x) {
            this.shape.pos.x += collision.overlapV.x * 2;
            this.velocity.x *= -1;
        }
        else {
            this.velocity.y *= -1;
            this.shape.pos.y += collision.overlapV.y * 2;
        }
    }
};

Ball.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.getX(), this.getY(), this.getSize(),
                0, 2 * Math.PI, false);
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.fill();
}