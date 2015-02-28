/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function BallTrail(x, y, size, direction, life) {
    this.shape = new SAT.Box(new SAT.Vector(x - size / 2, y - size / 2), size, size);

    this.size = size;
    this.life = life;
    this.maxLife = life;
}

BallTrail.prototype.isAlive = function() { return this.life > 0; };
BallTrail.prototype.getX = function() { return this.shape.pos.x; };
BallTrail.prototype.getY = function() { return this.shape.pos.y; };

BallTrail.prototype.update = function() {
    this.life --;
    this.size -= 1;
};

BallTrail.prototype.draw = function(context) {
    // context.beginPath();
    // context.arc(this.getX(), this.getY(), this.getSize(), 0, 2 * Math.PI, false);
    context.fillStyle = "rgba(100, 100, 100, " + this.life / this.maxLife + ")";
    // context.fill();

    // // restore to original state
    // context.restore();
    context.fillRect(this.getX(), this.getY(), this.size, this.size);
}