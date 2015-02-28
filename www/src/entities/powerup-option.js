/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function PowerupOption(x, y, powerup) {
    var padding = 20;

    this.height = 200;
    this.width = gameSize.width / 2 - 80;

    x = (gameSize.width + 80) * x / 2 + padding;

    if (y === 0)
        this.shape = new SAT.Box(new SAT.Vector(x, padding + 60), 
                                 this.width, this.height).toPolygon();
    else if (y === 1)
        this.shape = new SAT.Box(new SAT.Vector(x, gameSize.height - padding - this.height), 
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
    context.fillStyle = this.color || "rgb(255, 100, 100)";
    context.fillRect(this.getX(), this.getY(), this.width, this.height);

    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.font = "42pt Poiret One";
    var text = this.powerup.prototype.name;
    var textSize = context.measureText(text);
    context.fillText(text, this.getX() + 15, this.getY() + 60);

    context.font = "12pt Poiret One";
    var text = this.powerup.prototype.description;
    var textSize = context.measureText(text);
    context.fillText(text, this.getX() + 15, this.getY() + 100);
};