/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function PowerupOption(x, y, powerup) {
    var padding = 20;

    this.height = 120;
    this.width = gameSize.width / 2 - 90;

    this.x = (gameSize.width + 90) * x / 2 + padding;
    this.y = padding + 60
    if (y === 1)
        this.y = gameSize.height - padding - this.height;

    this.powerup = powerup;
}

PowerupOption.prototype.getX = function() { return this.x; };
PowerupOption.prototype.getY = function() { return this.y; };
PowerupOption.prototype.setX = function(x) { this.x = x; };
PowerupOption.prototype.setY = function(y) { this.y = y; };
PowerupOption.prototype.setWidth = function(width) { this.width = width; };
PowerupOption.prototype.setHeight = function(height) { this.height = height; };

PowerupOption.prototype.draw = function(context, player) {
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.font = "42pt Poiret One";
    var text = this.powerup.prototype.name;
    var textSize = context.measureText(text).width;

    var textX = 0;
    if (player == 0) {
        textX = ARROW_MARGIN - textSize/2;
    }
    else {
        textX = gameSize.width - ARROW_MARGIN - textSize/2;
    }
    context.fillText(text, textX, this.getY() + 60);
};
