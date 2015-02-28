/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Paddle(x, y, width, height) {
    this.height = height;
    this.width = width;

    this.shape = new SAT.Box(new SAT.Vector(x, y), width, height).toPolygon();
}

Paddle.prototype.getX = function() { return this.shape.pos.x; };
Paddle.prototype.getY = function() { return this.shape.pos.y; };
Paddle.prototype.getWidth = function() { return this.width; };
Paddle.prototype.getHeight = function() { return this.height; };
Paddle.prototype.moveX = function(dx) { this.shape.pos.x += dx; };
Paddle.prototype.moveY = function(dy) { this.shape.pos.y += dy; };
Paddle.prototype.setX = function(x) { this.shape.pos.x = x; };
Paddle.prototype.setY = function(y) { this.shape.pos.y = y; };
Paddle.prototype.setWidth = function(width) { this.width = width; };
Paddle.prototype.setHeight = function(height) { this.height = height; };

Paddle.prototype.draw = function(context) {
    context.fillStyle = this.color || "rgb(200, 200, 200)";
    context.fillRect(this.getX(), this.getY(), this.width, this.height);
};
 
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

/** 
 * Rectangles bounce when you click on em.  Iterate that animation here.
 */
function iterateBounciness(rect) {
   var bounceFactor = (Math.sin(rect.bounceTime) + 1) * rect.bounceTime * 0.15;
   if (rect.bounceTime > 0) {
       rect.bounceTime--;
   }
 
   var bouncedRect = new Paddle(0, 0, 0, 0);
   bouncedRect.x = rect.x - bounceFactor;
   bouncedRect.y = rect.y - bounceFactor;
   bouncedRect.width  = rect.width  + bounceFactor * 2;
   bouncedRect.height = rect.height + bounceFactor * 2;
   return bouncedRect;
}
 
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
