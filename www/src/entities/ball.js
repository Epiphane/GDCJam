/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
function Ball(x, y, radius, speed) {
    var direction = Math.random() > 0.5;
    var widthOfAngle = Math.PI / 2;
    var angle = Math.random() * widthOfAngle - widthOfAngle / 2;

    this.win = 0;
    this.shape = new SAT.Circle(new SAT.Vector(x, y), radius);

    this.velocity = {
        x: speed * Math.cos(angle) * (direction ? 1 : -1),
        y: speed * Math.sin(angle),
    }
    this.speedMult = 1;
    this.baseSpeed = speed;

    this.bounceTime = 0;
    this.bounceDuration = 10;

    this.trail = [];
    this.nextTrail = this.trailTimer = 1;

    this.juice = {
        color: false,
        trail: false,
        bounce: false,
        speedup: false,
        sound: false
    };

    this.opacity = 1;
}

Ball.prototype.getX = function() { return this.shape.pos.x; };
Ball.prototype.getY = function() { return this.shape.pos.y; };
Ball.prototype.getSize = function() { return this.shape.r; };
Ball.prototype.moveX = function(dx) { this.shape.pos.x += dx; };
Ball.prototype.moveY = function(dy) { this.shape.pos.y += dy; };
Ball.prototype.setX = function(x) { this.shape.pos.x = x; };
Ball.prototype.setY = function(y) { this.shape.pos.y = y; };
Ball.prototype.setSize = function(r) { this.shape.r = r; };

Ball.prototype.bounce = function() {
    if (this.juice.bounce) {
        this.bounceTime = this.bounceDuration;        
    }

    if (this.juice.speedup) {
        this.baseSpeed += 0.5;        
    }

    this.speedMult = 1;
    this.opacity = 1;
};

Ball.prototype.normalizeVelocity = function() {
    var currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + 
                                 this.velocity.y * this.velocity.y);

    this.velocity.x *= this.speedMult * this.baseSpeed / currentSpeed;
    this.velocity.y *= this.speedMult * this.baseSpeed / currentSpeed;
};

Ball.prototype.playRandomBounce = function() {
    if (this.speedMult === 1 && this.juice.sound) {
        var rand = Math.floor(Math.random() * 4);
        if (rand == 0) {
            bounce1.play();
        }
        if (rand == 1) {
            bounce2.play();
        }
        if (rand == 2) {
            bounce3.play();
        }
        if (rand == 3) {
            bounce4.play();
        }
    }
}

Ball.prototype.playRandomWall = function() {
    if (this.juice.sound) {
        var rand = Math.floor(Math.random() * 4);
        if (rand == 0) {
            wall1.play();
        }
        if (rand == 1) {
            wall2.play();
        }
        if (rand == 2) {
            wall3.play();
        }
        if (rand == 3) {
            wall4.play();
        }
    }
}

Ball.prototype.update = function(game) {
    // Movement and collision
    var flipY = function(off) {
        this.moveY(-2 * off);
        this.velocity.y *= -1;

        this.bounce();
    }.bind(this);

    var flipX = function(off) {
        this.moveX(-2 * off);
        this.velocity.x *= -1;

        this.bounce();
    }.bind(this);

    this.moveX(this.velocity.x);
    this.moveY(this.velocity.y);

    if (this.getX() + this.getSize() <= 0) {
        this.win = 2;
    }
    else if (this.getX() - this.getSize() >= gameSize.width) {
        this.win = 1;
    }

    if (!this.win) {
        if (this.getY() - this.getSize() <= 0) {
            flipY(this.getY() - this.getSize());
            this.playRandomWall();
        }
        else if (this.getY() + this.getSize() >= gameSize.height) {
            flipY(this.getY() + this.getSize() - gameSize.height);
            this.playRandomWall();
        }
        else if (this.getX() + this.getSize() >= gameSize.width && game.player2.hasPowerup(Shield)) {
            flipX(this.getX() + this.getSize() - gameSize.width);
            game.player2.removePowerup(Shield);
            this.playRandomWall();
        }
        else if (this.getX() - this.getSize() <= 0 && game.player1.hasPowerup(Shield)) {
            flipX(this.getX() - this.getSize());
            game.player1.removePowerup(Shield);
            this.playRandomWall();
        }

        var collision = new SAT.Response();

        if (game.portals) {
            if (SAT.testPolygonCircle(game.shape1, this.shape, collision) ||
                SAT.testPolygonCircle(game.shape2, this.shape, collision)) {
                // Portal 1 (From the Left)
                if (this.velocity.x > 0 && this.getX() < gameSize.width / 2) {
                    //console.log("case 1");
                    this.shape.pos.x = game.portal2.x + game.portal2.width + this.getSize() + 5;
                    this.shape.pos.y = game.portal2.y + 50;
                }
                // Portal 2 (From the Right)
                else if (this.velocity.x < 0 && this.getX() > gameSize.width / 2) {
                    //console.log("case 2");
                    this.shape.pos.x = game.portal1.x - this.getSize() - 5;
                    this.shape.pos.y = game.portal1.y + 50;
                }
                // Portal 1 (From the Right)
                else if (this.velocity.x < 0 && this.getX() < gameSize.width / 2) {
                    //console.log("case 3:" + this.velocity.x);
                    this.shape.pos.x = game.portal2.x + game.portal2.width + this.getSize() + 5;
                    this.shape.pos.y = game.portal2.y + 50;        
                    this.velocity.x *= -1;    
                }
                // Portal 2 (From the Left)
                else if (this.velocity.x > 0 && this.getX() > gameSize.width / 2) {
                    //console.log("case 4: " + this.velocity.x);
                    this.shape.pos.x = game.portal1.x - this.getSize() - 5;
                    this.shape.pos.y = game.portal1.y + 50;        
                    this.velocity.x *= -1;  
                }
            }
        }

        // Check for paddle collisions
        collision = new SAT.Response();
        // Player 1
        if (SAT.testPolygonCircle(game.player1.shape, this.shape, collision)) {
            if (collision.overlapV.x) {
                this.velocity.x *= -1;
                this.moveX(collision.overlapV.x);
            }
            else {
                this.velocity.y *= -1;
                this.moveY(collision.overlapV.y);
            }

            this.bounce();

            var dy = this.getY() - (game.player1.getY() + game.player1.getHeight() / 2);
            this.velocity.y = 16 * dy / game.player1.getHeight();
            this.normalizeVelocity();

            game.player1.hitBall();
            game.giveExperience(0);

            this.playRandomBounce();
        }

        // Player 2
        if (SAT.testPolygonCircle(game.player2.shape, this.shape, collision)) {
            if (collision.overlapV.x) {
                this.velocity.x *= -1;
                this.moveX(collision.overlapV.x);
            }
            else {
                this.velocity.y *= -1;
                this.moveY(collision.overlapV.y);
            }

            this.bounce();

            var dy = this.getY() - (game.player2.getY() + game.player2.getHeight() / 2);
            this.velocity.y = 16 * dy / game.player2.getHeight();
            this.normalizeVelocity();

            game.player2.hitBall();
            game.giveExperience(1);
            
            this.playRandomBounce();
        }

        game.player1.ballDist(this.getX(), this.getY(), this.velocity.x < 0);
        game.player2.ballDist(this.getX(), this.getY(), this.velocity.x > 0);

        var speed = Math.ceil(Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)));
        //console.log(speed);

        this.otherFrame = !this.otherFrame;
        if (this.juice.trail) {
            var newTrail, minHue = 0, maxHue = 1;
            if (this.speedMult > 1) {
                maxHue = 1 / 5;
            }
            else if (this.speedMult < 1) {
                minHue = 200 / 360;
                maxHue = 250 / 360;
            }

            newTrail = new BallTrail(this.getX(), this.getY(), 25,
                       this.velocity.y, this.velocity.x, 60, minHue, maxHue,
                       this.speedMult > 1, this.speedMult < 1);
            
            newTrail.juice.color = this.juice.color;
            if (this.otherFrame || this.juice.color) {
                this.trail.push(newTrail);
            }
        }
    
        for(var t = 0; t < this.trail.length; t ++) {
            this.trail[t].update();
            if (!this.trail[t].isAlive()) {
                this.trail.splice(t--, 1);
            }
        }
    }
};

Ball.prototype.draw = function(context) {
    context.globalAlpha = this.opacity;

    for(var t = 0; t < this.trail.length; t ++) {
        this.trail[t].draw(context);
    }

    var dt = this.bounceDuration - this.bounceTime;
    scale = {};
    scale.y = 1;
    scale.x = 1 - 0.5 * Math.sin(2 * Math.PI * dt / this.bounceDuration);

    if (this.bounceTime > 0) {
        this.bounceTime --;
    }

    // save state
    context.save();

    // scale context horizontally
    context.translate(this.getX(), this.getY());
    context.rotate(Math.atan(this.velocity.y / this.velocity.x));
    context.scale(scale.x, scale.y);

    context.beginPath();
    context.arc(0, 0, this.getSize(), 0, 2 * Math.PI, false);

    if (this.juice.color) {
        var rgb = HSVtoRGB(hue, 0.6, 1);
        context.fillStyle = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1)";
    }
    else {
        if (this.speedMult > 1)
            context.fillStyle = "rgba(255, 0, 0, 1)";
        else if (this.speedMult < 1)
            context.fillStyle = "rgba(0, 0, 255, 1)";
        else
            context.fillStyle = "rgba(255, 255, 255, 1)";
    }

    context.fill();

    // restore to original state
    context.restore();
    context.globalAlpha = 1;
}
