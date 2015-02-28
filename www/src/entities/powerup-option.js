/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function PowerupOption(x, y, powerup) {
    var padding = 40;

    this.height = gameSize.height / 2 - 2 * padding - 60;
    this.width = gameSize.width / 2 - 2 * padding;

    if (y === 0)
        this.shape = new SAT.Box(new SAT.Vector(gameSize.width * x / 2 + padding, 
                                                gameSize.height - padding - this.height), 
                                 this.width, this.height).toPolygon();
    else if (y === 1)
        this.shape = new SAT.Box(new SAT.Vector(gameSize.width * x / 2 + padding, 
                                                padding), 
                                 this.width, this.height).toPolygon();

    this.powerup = powerup;
}

PowerupOption.prototype.getX = function() { return this.shape.pos.x; };
PowerupOption.prototype.getY = function() { return this.shape.pos.y; };
PowerupOption.prototype.setX = function(x) { this.shape.pos.x = x; };
PowerupOption.prototype.setY = function(y) { this.shape.pos.y = y; };
PowerupOption.prototype.setWidth = function(width) { this.width = width; };
PowerupOption.prototype.setHeight = function(height) { this.height = height; };

PowerupOption.prototype.draw = function(context) {
    // context.save();

    // context.translate(this.getX() + this.width / 2, this.getY() + this.height / 2);
    // context.scale(this.bounceFactor, this.bounceFactor);

    context.fillStyle = this.color || "rgb(255, 100, 100)";
    context.fillRect(this.getX(), this.getY(), this.width, this.height);
};