/**
 * Rectangle class.  Origin at (x, y), with specified width and height.
 *  bounceTime lets us animate bounciness on mouse down.
 */
function Player(p, speed) {
    this.player = p;
    this.ready = false;

    this.width = 20;
    this.height = 140;

    this.dy = 0;
    this.max_dy = 500;
    this.speed = 300;

    this.juice = {
        color: false,
        shape: false
    };

    this.angle = 0;
    this.dir = 1;
    this.powerups = [];

    this.box = new SAT.Box(new SAT.Vector(0, 0), this.width, this.height);
    this.shape = this.box.toPolygon();
}

Player.prototype.updateShape = function() {
    this.box = new SAT.Box(new SAT.Vector(this.getX(), this.getY()), this.width, this.height);
    this.shape = this.box.toPolygon();
};

Player.prototype.hasPowerup = function(powerup) {
    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (this.powerups[ndx].constructor === powerup) {
            return true;
        }
    }

    return false;
};

Player.prototype.removePowerup = function(powerup) {
    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (this.powerups[ndx].constructor === powerup) {
            this.powerups[ndx].done();
            this.powerups.splice(ndx, 1);
            return;
        }
    }
};

Player.prototype.addPowerup = function(powerup, x, y, doAction) {
    powerup.start();
    if (doAction)
        powerup.action();
    powerup.x = x;
    powerup.y = y;
    if (powerup.uses <= 0) {
        powerup.done();
    }
    else {
        this.powerups.push(powerup);
    }
};

Player.prototype.getX = function() { return this.shape.pos.x; };
Player.prototype.getY = function() { return this.shape.pos.y; };
Player.prototype.getWidth = function() { return this.width; };
Player.prototype.getHeight = function() { return this.height; };
Player.prototype.moveX = function(dx) { this.shape.pos.x += dx; };
Player.prototype.moveY = function(dy) { this.shape.pos.y += dy; };
Player.prototype.setX = function(x) { this.shape.pos.x = x; };
Player.prototype.setY = function(y) { this.shape.pos.y = y; };
Player.prototype.setWidth = function(width) { this.width = width; this.updateShape(); };
Player.prototype.setHeight = function(height) { this.height = height; this.updateShape(); };

Player.prototype.accelerate = function(dy) {
    this.dy += dy;

    if (this.dy > this.max_dy) {
        this.dy = this.max_dy;
    }
    if (this.dy < -this.max_dy) {
        this.dy = -this.max_dy
	}
};

Player.prototype.hitBall = function() {
    this.bounceTime = 40;

    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        this.powerups[ndx].action();

        if (this.powerups[ndx].uses <= 0) {
            this.powerups[ndx].done();
            this.powerups.splice(ndx--, 1);
        }
    }
};

Player.prototype.ballDist = function(ballX, ballY, approaching) {
    var dx = Math.abs(ballX - this.getX() + this.getWidth() / 2) / GAME_WIDTH;
    var dy = Math.abs(ballY - this.getY() + this.getHeight() / 2) / GAME_HEIGHT;

    dx = dx * 1.2 - 0.1;
    if (dx < 0) dx = 0;
    if (dx > 1) dx = 1;

    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (approaching)
            this.powerups[ndx].approach(dx, dy);
        else
            this.powerups[ndx].moveAway(1 - dx, 1 - dy);
    }
};

Player.prototype.update = function(dt) {
    var dist = dt * this.dy;
	if (this.getY() + dist >= 0 && this.getY() + this.getHeight() + dist <= GAME_HEIGHT) {
    	this.moveY(dist);
    	this.dy *= 0.6;
	}
	else {
		this.dy = 0;
	}

    if (this.getY() <= 0)
        this.setY(0);
    if (this.getY() + this.getHeight() > GAME_HEIGHT)
        this.setY(GAME_HEIGHT - this.getHeight());

    if (InputManager.control(this.player, CONTROLS.UP))
        this.accelerate(-this.speed * this.dir);
    if (InputManager.control(this.player, CONTROLS.DOWN))
        this.accelerate(this.speed * this.dir);

    if (this.bounceTime && this.juice.bounce)
        this.jiggle();
};

Player.prototype.draw = function(context) {
	context.save();

	context.translate(this.getX() + this.width / 2, this.getY() + this.height / 2);
    if (this.angle > 0) {
        context.rotate(this.angle);
        this.angle -= Math.PI / 16;
    }
	context.scale(this.bounceFactor, this.bounceFactor);

    context.fillStyle = "rgb(200, 200, 200)";
    if (this.juice.color) {
        if (this.player === 0)
            context.fillStyle = "rgb(255, 0, 0)";
        else
            context.fillStyle = "rgb(0, 0, 255)";
    }

    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.restore();
    
    var powerupX;
    var ICON_WIDTH = 48;
    if (this.getX() < GAME_WIDTH / 2)
        powerupX = 20;
    else
        powerupX = GAME_WIDTH - (20 + ICON_WIDTH);
    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (this.powerups[ndx].__proto__.icon) {
            var targetX = powerupX;
            var targetY = GAME_HEIGHT - (20 + ICON_WIDTH);
            var diffX = targetX - this.powerups[ndx].x;
            var diffY = targetY - this.powerups[ndx].y;

            context.drawImage(this.powerups[ndx].__proto__.icon, 
                              this.powerups[ndx].x, this.powerups[ndx].y);
            this.powerups[ndx].x += diffX / 6;
            this.powerups[ndx].y += diffY / 6;

            if (this.player === 0)
                powerupX += (20 + ICON_WIDTH);
            else
                powerupX -= (20 + ICON_WIDTH);
        }
    }
};

Player.prototype.jiggle = function() {
	this.bounceFactor = 1 + (Math.sin(this.bounceTime) + 1) * this.bounceTime * 0.005;
    if (this.bounceTime > 0) {
       this.bounceTime--;
    }
}
