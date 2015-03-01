function makeIcon(name) {
    var imageObj = new Image();

    imageObj.src = './asset/icons/png/' + name + '.png';
    return imageObj;
}

/* Powerup Service */
var Powerup = function(game, player) {
    this.uses = 10;
    this.game = game;
    this.player = player;

    if (!this.__proto__.start)
        this.__proto__.start = Powerup.prototype.start;
    if (!this.__proto__.action)
        this.__proto__.action = Powerup.prototype.action;
    if (!this.__proto__.approach)
        this.__proto__.approach = Powerup.prototype.approach;
    if (!this.__proto__.moveAway)
        this.__proto__.moveAway = Powerup.prototype.moveAway;
    if (!this.__proto__.done)
        this.__proto__.done = Powerup.prototype.done;
};
Powerup.prototype.name = "Nothing";
Powerup.prototype.description = "You shouldn't be seeing this, you dingus!";
Powerup.prototype.sound = null;

Powerup.prototype.start = function() {
    if (this.__proto__.sound) {
        this.__proto__.sound.play();
    }
};
Powerup.prototype.action = function() {
    this.uses --;
};
// dx is a percentage: 0 = at the paddle, 1 = at the enemy paddle
// dy is a percentage: 0 = at the paddle, 1 = across the screen
Powerup.prototype.approach = function(dx, dy) {};
// dx is a percentage: 1 = at the paddle, 0 = at the enemy paddle
// dy is a percentage: 1 = at the paddle, 0 = across the screen
Powerup.prototype.moveAway = function(dx, dy) {};
Powerup.prototype.done = function() {};

/* Widen your "bar" */

var WideBar = function() { Powerup.apply(this, arguments); };

WideBar.prototype.constructor = WideBar;
WideBar.prototype.name = "Wide Paddle";
WideBar.prototype.description = "May your paddle be wide and your future be bright!";
WideBar.prototype.icon = makeIcon("expand42");

WideBar.prototype.start = function() {
    this.originalHeight = this.player.getHeight();

    this.player.setHeight(this.originalHeight * 1.5);
    this.player.updateShape();
};
WideBar.prototype.done = function() {
    this.player.setHeight(this.originalHeight);
    this.player.updateShape();
};

var FireBall = function() { 
    Powerup.apply(this, arguments);
    this.uses = 3; 
};

FireBall.prototype.constructor = FireBall;
FireBall.prototype.name = "FIREBALL";
FireBall.prototype.description = "Description";
FireBall.prototype.icon = makeIcon("fire14");
FireBall.prototype.sound = fireChosen;

FireBall.prototype.action = function() {
    this.game.ball.speedMult = 1.5;
    this.game.ball.normalizeVelocity();

    this.uses--;

    var rand = Math.floor(Math.random() * 2);
    if (rand == 0) {
        fire1.play();
    }
    if (rand == 1) {
        fire2.play();
    }
};

var IceBall = function() { 
    Powerup.apply(this, arguments);
    this.uses = 3; 
};

IceBall.prototype.constructor = IceBall;
IceBall.prototype.name = "ICEBALL";
IceBall.prototype.description = "Description";
IceBall.prototype.icon = makeIcon("snowflake");
IceBall.prototype.sound = iceChosen;

var playedIceSound = false;  // Global flags are fun 
IceBall.prototype.approach = function(dx, dy) {
    this.game.ball.speedMult = 0.5;
    this.game.ball.normalizeVelocity();

    if (!playedIceSound) {
        var rand = Math.floor(Math.random() * 3);
        if (rand == 0) {
            ice1.play();
        }
        if (rand == 1) {
            ice2.play();
        }
        if (rand == 2) {
            ice3.play();
        }

        playedIceSound = true;
    }
};

IceBall.prototype.action = function() {
    this.uses--;
    this.game.ball.speedMult = 1;
    this.game.ball.normalizeVelocity();
    playedIceSound = false;
};

var Shield = function() { 
    Powerup.apply(this, arguments);
    this.uses = 2; 
};

Shield.prototype.constructor = Shield;
Shield.prototype.name = "SHIELD";
Shield.prototype.description = "Description";
Shield.prototype.icon = makeIcon("shield");
Shield.prototype.action = function() {};

var GhostBall = function() { 
    Powerup.apply(this, arguments);
};

GhostBall.prototype.constructor = GhostBall;
GhostBall.prototype.name = "Ghost";
GhostBall.prototype.description = "Description";
GhostBall.prototype.icon = makeIcon("ghost2");

GhostBall.prototype.moveAway = function(dx, dy) {
    this.game.ball.opacity = dx;
};

var AddJuice = function() { 
    Powerup.apply(this, arguments);
};

Powerup.prototype.available = [WideBar, Shield, GhostBall, FireBall, IceBall];

(function() {
    Powerup.getRandomPowerup = function(game, player) {
        var p = (player === 1 ? game.player1 : game.player2);
        var ndx = Math.floor(Math.random() * Powerup.prototype.available.length);
        while(Powerup.prototype.available[ndx] !== Shield && 
            p.hasPowerup(Powerup.prototype.available[ndx])) {
            ndx = Math.floor(Math.random() * Powerup.prototype.available.length);
        }
        console.log(p.powerups, Powerup.prototype.available[ndx]);

        return Powerup.prototype.available[ndx];
    };
})();