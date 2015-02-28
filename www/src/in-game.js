/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Paddle(x, y, width, height) {
    this.x2 = function() { return this.shape.pos.x + this.width };
    this.y2 = function() { return this.shape.pos.y + this.height };
    this.height = height;
    this.width = width;
    this.bounceTime = 0;

    this.shape = new SAT.Box(new SAT.Vector(x, y), width, height).toPolygon();
}

Paddle.prototype.draw = function(context) {
    this.shape.pos.x = this.shape.pos.x;
    this.shape.pos.y = this.shape.pos.y;

    context.fillStyle = this.color || "rgb(200, 200, 200)";
    context.fillRect(this.shape.pos.x, this.shape.pos.y, this.width, this.height);
}
 
/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function Ball(x, y, radius, speed) {
    this.radius = radius;

    var direction = Math.random() > 0.5;
    var widthOfAngle = Math.PI / 2;
    var angle = Math.random() * widthOfAngle - widthOfAngle / 2;

    this.shape = new SAT.Circle(new SAT.Vector(x, y), radius);

    this.velocity = {
        x: speed * Math.cos(angle) * (direction ? 1 : -1),
        y: speed * Math.sin(angle),
    }
}

Ball.prototype.update = function(game) {
    this.shape.pos.x += this.velocity.x;
    this.shape.pos.y += this.velocity.y;

    if (this.shape.pos.y - this.radius <= 0) {
        this.shape.pos.y = 2 * this.radius - this.shape.pos.y;
        this.velocity.y *= -1;
    }
    else if (this.shape.pos.y + this.radius >= canvas.height) {
        var offset = this.shape.pos.y + this.radius - canvas.height;
        this.shape.pos.y = this.shape.pos.y - 2 * offset;
        this.velocity.y *= -1;
    }

    // Check for paddle collisions
    var collision = new SAT.Response();
    if (SAT.testPolygonCircle(game.player1.shape, this.shape, collision)) {
        this.shape.pos.x += collision.overlapV.x * 2;
        if (collision.overlapV.x)
            this.velocity.x *= -1;

        this.shape.pos.y += collision.overlapV.y * 2;
        if (collision.overlapV.y)
            this.velocity.y *= -1;
    }
    if (SAT.testPolygonCircle(game.player2.shape, this.shape, collision)) {
        this.shape.pos.x += collision.overlapV.x * 2;
        if (collision.overlapV.x)
            this.velocity.x *= -1;

        this.shape.pos.y += collision.overlapV.y * 2;
        if (collision.overlapV.y)
            this.velocity.y *= -1;
    }
};

Ball.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.shape.pos.x, this.shape.pos.y, 
                this.radius, 0, 2*Math.PI, false);
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
        this.player2.shape.pos.y -= this.speed;
    if (keyDown[KEYS.DOWN])
        this.player2.shape.pos.y += this.speed;

    if (keyDown[KEYS.W])
        this.player1.shape.pos.y -= this.speed;
    if (keyDown[KEYS.S])
        this.player1.shape.pos.y += this.speed;

    this.ball.update(this);
};

InGame.prototype.draw = function(context) {
    this.player1.draw(context);
    this.player2.draw(context);

    this.ball.draw(context);
};
