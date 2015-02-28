/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Paddle(x, y, width, height) {
    this.height = height;
    this.width = width;
    this.bounceTime = 0;
    this.bounceFactor = 1;

    this.dy = 0;
    this.max_dy = 20;

    this.shape = new SAT.Box(new SAT.Vector(x - width / 2, y - height / 2), width, height).toPolygon();

    this.powerups = [];
    this.exp = 50;
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

    if (this.dy > this.max_dy) {
        this.dy = this.max_dy;
    }
    if (this.dy < -this.max_dy) {
        this.dy = -this.max_dy
	}
};

Paddle.prototype.update = function() {
	if (this.getY() + this.dy >= 0 && this.getY() + this.getHeight() + this.dy <= canvas.height) {
    	this.moveY(this.dy);
    	this.dy *= 0.6;
	}
	else {
		this.dy = 0;
	}
};

Paddle.prototype.draw = function(context) {
	context.save();

	context.translate(this.getX() + this.width / 2, this.getY() + this.height / 2);
	context.scale(this.bounceFactor, this.bounceFactor);

    context.fillStyle = this.color || "rgb(200, 200, 200)";
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.restore();
};

Paddle.prototype.jiggle = function() {
	this.bounceFactor = 1 + (Math.sin(this.bounceTime) + 1) * this.bounceTime * 0.005;
    if (this.bounceTime > 0) {
       this.bounceTime--;
    }
}
