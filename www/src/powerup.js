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
WideBar.prototype.name = "WIDE PADDLE";
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
Shield.prototype.icon = makeIcon("shield");
Shield.prototype.action = function() {};

var Portals = function() { 
    Powerup.apply(this, arguments);
    this.uses = 5; 
};

Portals.prototype.constructor = Portals;
Portals.prototype.name = "PORTALS";
Portals.prototype.icon = makeIcon("portal");

Portals.prototype.action = function() {
    if (this.uses > 0 && !this.game.portals) {
        this.game.portals = true;

        this.game.portal1.x = gameSize.width / 2 - 10 - Math.random() * gameSize.width / 8;
        this.game.portal1.y = Math.random() * (gameSize.height - 100);
        this.game.portal1.width = this.game.ball.getSize() + 10;

        this.game.portal2.x = gameSize.width / 2 + 10 + Math.random() * gameSize.width / 8;
        this.game.portal2.y = Math.random() * (gameSize.height - 100);
        this.game.portal2.width = this.game.ball.getSize() + 10;

        this.game.shape1 = new SAT.Box(new SAT.Vector(this.game.portal1.x, this.game.portal1.y), this.game.ball.getSize() + 10, 100).toPolygon();
        this.game.shape2 = new SAT.Box(new SAT.Vector(this.game.portal2.x, this.game.portal2.y), this.game.ball.getSize() + 10, 100).toPolygon();
    }

    this.uses--;

    if (!this.uses) {
        this.game.portals = false;
    }
};

var GhostBall = function() { 
    Powerup.apply(this, arguments);
    this.uses = 4;
};

GhostBall.prototype.constructor = GhostBall;
GhostBall.prototype.name = "GHOST";
GhostBall.prototype.icon = makeIcon("ghost2");

GhostBall.prototype.moveAway = function(dx, dy) {
    this.game.ball.opacity = dx;
};

var ReverseControls = function() { 
    Powerup.apply(this, arguments);
    this.uses = 4;
};

ReverseControls.prototype.constructor = ReverseControls;
ReverseControls.prototype.name = "FLIP ENEMY";
ReverseControls.prototype.icon = makeIcon("reverse");

ReverseControls.prototype.start = function() {
    if (this.player.player === 1) {
        KEYS.UP = 40;
        KEYS.DOWN = 38;
        this.game.player2.angle = Math.PI;
    }
    else {
        KEYS.W = 83;
        KEYS.S = 87;
        this.game.player1.angle = Math.PI;
    }
}
ReverseControls.prototype.done = function() {
    if (this.player.player === 1) {
        KEYS.DOWN = 40;
        KEYS.UP = 38;
        this.game.player2.angle = Math.PI;
    }
    else {
        KEYS.S = 83;
        KEYS.W = 87;
        this.game.player1.angle = Math.PI;
    }
}

var Magnet = function() { 
    Powerup.apply(this, arguments);
    this.uses = 5;
};

Magnet.prototype.constructor = Magnet;
Magnet.prototype.name = "MAGNET";
Magnet.prototype.icon = makeIcon("magnet");

Magnet.prototype.approach = Magnet.prototype.moveAway = function(dx, dy) {
    dy = this.player.getY() + this.player.getHeight() / 2 - this.game.ball.getY();

    this.game.ball.moveY(dy / 40);
};

Powerup.prototype.available = [Magnet, WideBar, Shield, GhostBall, FireBall, IceBall, Portals, ReverseControls];

(function() {
    Powerup.getRandomPowerup = function(game, player, other) {
        var p = (player === 1 ? game.player1 : game.player2);
        var ndx = Math.floor(Math.random() * Powerup.prototype.available.length);
        while(Powerup.prototype.available[ndx] !== Shield && 
            p.hasPowerup(Powerup.prototype.available[ndx]) &&
            Powerup.prototype.available[ndx] !== other) {
            ndx = Math.floor(Math.random() * Powerup.prototype.available.length);
        }

        return Powerup.prototype.available[ndx];
    };
})();
