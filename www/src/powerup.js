function makeIcon(name) {
    var imageObj = new Image();

    imageObj.src = './asset/icons/png/' + name + '.png';
    return imageObj;
}

/* Powerup Service */
var Powerup = function(game, player) {
    this.uses = 6;
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

(function() {
    Powerup.getRandomPowerup = function() {
        return Portals;
    };
})();

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
IceBall.prototype.icon = makeIcon("expand42");
FireBall.prototype.sound = fireChosen;

IceBall.prototype.approach = function(dx, dy) {
    this.game.ball.speedMult = 0.5;
    this.game.ball.normalizeVelocity();
};

var Shield = function() { 
    Powerup.apply(this, arguments);
    this.uses = 2; 
};

Shield.prototype.constructor = Shield;
Shield.prototype.name = "SHIELD";
Shield.prototype.description = "Description";
Shield.prototype.icon = makeIcon("expand42");

Shield.prototype.action = function() {
    if (this.uses === 2) {
        if (this.player.player === 1) {
            this.game.p1shield = true;
        }
        else {
            this.game.p2shield = true;
        }
    }

    this.uses--;
};

var Portals = function() { 
    Powerup.apply(this, arguments);
    this.uses = 5; 
};

Portals.prototype.constructor = Portals;
Portals.prototype.name = "PORTALS";
Portals.prototype.description = "Description";
Portals.prototype.icon = makeIcon("expand42");

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
