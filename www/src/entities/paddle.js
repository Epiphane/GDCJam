/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Paddle(x, y, width, height) {
    this.height = height;
    this.width = width;

    this.dy = 0;
    this.max_dy = 20;

    this.shape = new SAT.Box(new SAT.Vector(x - width / 2, y - height / 2), width, height).toPolygon();
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

Paddle.prototype.accelerate = function(dy) {
    this.dy += dy;

    if (this.dy > this.max_dy)
        this.dy = this.max_dy;
    if (this.dy < -this.max_dy)
        this.dy = -this.max_dy
};

Paddle.prototype.update = function() {
    this.moveY(this.dy);

    this.dy *= 0.4;
};

Paddle.prototype.draw = function(context) {
    context.fillStyle = this.color || "rgb(200, 200, 200)";
    context.fillRect(this.getX(), this.getY(), this.width, this.height);
};