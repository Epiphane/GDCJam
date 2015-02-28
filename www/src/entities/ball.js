/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function Ball(x, y, radius, speed) {
    var direction = Math.random() > 0.5;
    var widthOfAngle = Math.PI / 2;
    var angle = Math.random() * widthOfAngle - widthOfAngle / 2;

    this.win = 0;
    this.shape = new SAT.Circle(new SAT.Vector(x, y), radius);

    this.velocity = {
        x: speed * Math.cos(angle) * (direction ? 1 : -1),
        y: speed * Math.sin(angle),
    }

    this.bounceTime = 0;
    this.bounceDuration = 10;

    this.trail = [];
    this.nextTrail = this.trailTimer = 1;
}

Ball.prototype.getX = function() { return this.shape.pos.x; };
Ball.prototype.getY = function() { return this.shape.pos.y; };
Ball.prototype.getSize = function() { return this.shape.r; };
Ball.prototype.moveX = function(dx) { this.shape.pos.x += dx; };
Ball.prototype.moveY = function(dy) { this.shape.pos.y += dy; };
Ball.prototype.setX = function(x) { this.shape.pos.x = x; };
Ball.prototype.setY = function(y) { this.shape.pos.y = y; };
Ball.prototype.setSize = function(r) { this.shape.r = r; };

Ball.prototype.bounce = function() {
    this.bounceTime = this.bounceDuration;
}

Ball.prototype.update = function(game) {
    // Movement and collision
    var flipY = function(off) {
        this.moveY(-2 * off);
        this.velocity.y *= -1;

        this.bounce();
    }.bind(this);

    this.moveX(this.velocity.x);
    this.moveY(this.velocity.y);

    if (this.getX() + this.getSize() <= 0) {
        this.win = 2;
    }
    else if (this.getX() - this.getSize() >= canvas.width) {
        this.win = 1;
    }

    if (!this.win) {
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

            game.player1.bounceTime = 40;
            this.bounce();
        }
        if (game.player1.bounceTime) {
            game.player1.jiggle();
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

            game.player2.bounceTime = 40;
            this.bounce();
        }
        if (game.player2.bounceTime) {
            game.player2.jiggle();
        }
    }

    // Create trail!
    if (this.nextTrail-- <= 0) {
        this.nextTrail = this.trailTimer;

        this.trail.push(new BallTrail(this.getX(), this.getY(), 25,
                        Math.atan(this.velocity.y / this.velocity.x), 45));
    }

    for(var t = 0; t < this.trail.length; t ++) {
        this.trail[t].update();
        if (!this.trail[t].isAlive())
            this.trail.splice(t--, 1);
    }
};

Ball.prototype.draw = function(context) {
    for(var t = 0; t < this.trail.length; t ++) {
        this.trail[t].draw(context);
    }

    scale = {};
    scale.y = 1;
    scale.x = 1 - 0.5 * Math.sin(2 * Math.PI * (this.bounceDuration - this.bounceTime) / this.bounceDuration);

    if (this.bounceTime > 0) {
        this.bounceTime --;
    }

    // save state
    context.save();

    // scale context horizontally
    context.translate(this.getX(), this.getY());
    context.rotate(Math.atan(this.velocity.y / this.velocity.x));
    context.scale(scale.x, scale.y);

    context.beginPath();
    context.arc(0, 0, this.getSize(), 0, 2 * Math.PI, false);
    context.fillStyle = "rgba(0, 255, 255, 1)";
    context.fill();

    // restore to original state
    context.restore();
}