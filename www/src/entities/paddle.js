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

    if (x < gameSize.width / 2) {
    	this.player = 1;
    }
    else {
    	this.player = 2;
    }

    this.juice = {
        color: false
    };

    this.shape = new SAT.Box(new SAT.Vector(x - width / 2, y - height / 2), width, height).toPolygon();

    this.angle = 0;
}

Paddle.prototype.updateShape = function() {
    this.shape = new SAT.Box(new SAT.Vector(this.getX(), this.getY()), 
                            this.getWidth(), this.getHeight()).toPolygon();
};

Paddle.prototype.setPowerups = function(powerups) {
    this.powerups = powerups;

    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        this.powerups[ndx].player = this;
        this.powerups[ndx].start();
    }
}

Paddle.prototype.hasPowerup = function(powerup) {
    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (this.powerups[ndx].constructor === powerup) {
            return true;
        }
    }

    return false;
}

Paddle.prototype.removePowerup = function(powerup) {
    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (this.powerups[ndx].constructor === powerup) {
            this.powerups[ndx].done();
            this.powerups.splice(ndx, 1);
            return;
        }
    }
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

Paddle.prototype.addPowerup = function(powerup, x, y) {
    powerup.start();
    powerup.action();
    powerup.x = x;
    powerup.y = y;
    if (powerup.uses <= 0) {
    	powerup.done();
    }
    else {
    	this.powerups.push(powerup);
    }
    // console.log(powerup.uses);
};

Paddle.prototype.accelerate = function(dy) {
    this.dy += dy;

    if (this.dy > this.max_dy) {
        this.dy = this.max_dy;
    }
    if (this.dy < -this.max_dy) {
        this.dy = -this.max_dy
	}
};

Paddle.prototype.hitBall = function() {
    this.bounceTime = 40;

    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        this.powerups[ndx].action();

        if (this.powerups[ndx].uses <= 0) {
            this.powerups[ndx].done();
            this.powerups.splice(ndx--, 1);
        }
    }
};

Paddle.prototype.ballDist = function(ballX, ballY, approaching) {
    var dx = Math.abs(ballX - this.getX() + this.getWidth() / 2) / gameSize.width;
    var dy = Math.abs(ballY - this.getY() + this.getHeight() / 2) / gameSize.height;

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

Paddle.prototype.update = function() {
	if (this.getY() + this.dy >= 0 && this.getY() + this.getHeight() + this.dy <= gameSize.height) {
    	this.moveY(this.dy);
    	this.dy *= 0.6;
	}
	else {
		this.dy = 0;
	}

    if (this.getY() <= 0)
        this.setY(0);
    if (this.getY() + this.getHeight() > gameSize.height)
        this.setY(gameSize.height - this.getHeight());

    if (this.bounceTime && this.juice.bounce)
        this.jiggle();
};

Paddle.prototype.draw = function(context) {
	context.save();

	context.translate(this.getX() + this.width / 2, this.getY() + this.height / 2);
    if (this.angle > 0) {
        context.rotate(this.angle);
        this.angle -= Math.PI / 16;
    }
	context.scale(this.bounceFactor, this.bounceFactor);

    context.fillStyle = "rgb(200, 200, 200)";
    if (this.juice.color) {
        if (this.player === 1)
            context.fillStyle = "rgb(255, 0, 0)";
        else
            context.fillStyle = "rgb(0, 0, 255)";
    }

    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.restore();
    
    var powerupX;
    var ICON_WIDTH = 48;
    if (this.getX() < gameSize.width / 2)
        powerupX = 20;
    else
        powerupX = gameSize.width - (20 + ICON_WIDTH);
    for (var ndx = 0; ndx < this.powerups.length; ndx ++) {
        if (this.powerups[ndx].__proto__.icon) {
            var targetX = powerupX;
            var targetY = gameSize.height - (20 + ICON_WIDTH);
            var diffX = targetX - this.powerups[ndx].x;
            var diffY = targetY - this.powerups[ndx].y;

            context.drawImage(this.powerups[ndx].__proto__.icon, 
                              this.powerups[ndx].x, this.powerups[ndx].y);
            this.powerups[ndx].x += diffX / 6;
            this.powerups[ndx].y += diffY / 6;

            if (this.player === 1)
                powerupX += (20 + ICON_WIDTH);
            else
                powerupX -= (20 + ICON_WIDTH);
        }
    }
};

Paddle.prototype.jiggle = function() {
	this.bounceFactor = 1 + (Math.sin(this.bounceTime) + 1) * this.bounceTime * 0.005;
    if (this.bounceTime > 0) {
       this.bounceTime--;
    }
}
