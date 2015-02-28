/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.x2 = function() { return this.x + this.width };
    this.y2 = function() { return this.y + this.height };
    this.height = height;
    this.width = width;
    this.bounceTime = 0;
}

Paddle.prototype.draw = function(context) {
    context.fillStyle = this.color || "rgb(200, 200, 200)";
    context.fillRect(this.x, this.y, this.width, this.height);
}
 
/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function Ball(x, y, radius, alpha) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.alpha = 0.4;
}
 
/**
 * rectIntersection takes in two rectangle objects and determines whether they
 *  intersect.
 *
 * If they intersect, this function returns the rectangle that represents the area
 *  they intersect. Otherwise, it returns null.
 */
function rectIntersection(rectA, rectB) {
    var intersectTop    = Math.max(rectA.y,    rectB.y);
    var intersectRight  = Math.min(rectA.x2(), rectB.x2());
    var intersectBottom = Math.min(rectA.y2(), rectB.y2());
    var intersectLeft   = Math.max(rectA.x,    rectB.x);
 
    var intersectWidth  = intersectRight - intersectLeft;
    var intersectHeight = intersectBottom - intersectTop;
 
    if (intersectWidth > 0 && intersectHeight > 0) {
        return new Paddle(intersectLeft, intersectTop, intersectWidth, intersectHeight);
    }
    return null;
}
 
/**
 * rectContainsPoint returns true if the specified rectangle contains the point,
 *  false otherwise.
 */
function rectContainsPoint(rect, point) {
    if (point.x > rect.x && point.x < rect.x2() &&
        point.y > rect.y && point.y < rect.y2() ) {
        return true;
    }
    return false;
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
    var ballSize = 30;
    this.speed = 8;

    // "Entities"
    this.player1 = new Paddle(distFromEdge, canvas.height / 2, initialSize.w, initialSize.h);
    this.player2 = new Paddle(canvas.width - distFromEdge - initialSize.w, canvas.height / 2, initialSize.w, initialSize.h);
    this.ball = new Ball(canvas.width / 2 - ballSize / 2,
                         canvas.height / 2 - ballSize / 2,
                         ballSize, ballSize);
}

InGame.prototype.init = function() {
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function() {
    if (keyDown[KEYS.UP])
        this.player2.y -= this.speed;
    if (keyDown[KEYS.DOWN])
        this.player2.y += this.speed;

    if (keyDown[KEYS.W])
        this.player1.y -= this.speed;
    if (keyDown[KEYS.S])
        this.player1.y += this.speed;
};

InGame.prototype.draw = function(context) {
    this.player1.draw(context);
    this.player2.draw(context);

    context.beginPath();
    context.arc(this.ball.x, this.ball.y, 
                this.ball.radius, 0, 2*Math.PI, false);
    context.fillStyle = "rgba(255, 255, 255, " + this.ball.alpha + ")";
    context.fill();
};
