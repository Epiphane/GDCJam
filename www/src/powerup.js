function makeIcon(name) {
    var imageObj = new Image();

    imageObj.src = '/asset/icons/png/' + name + '.png';
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
    if (!this.__proto__.done)
        this.__proto__.done = Powerup.prototype.done;
};
Powerup.prototype.name = "Nothing";
Powerup.prototype.description = "You shouldn't be seeing this, you dingus!";

Powerup.prototype.start = function() {};
Powerup.prototype.action = function() {
    this.uses --;
};
Powerup.prototype.done = function() {};

(function() {
    Powerup.getRandomPowerup = function() {
        return IceBall;
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
FireBall.prototype.icon = makeIcon("expand42");

FireBall.prototype.action = function() {
    this.game.ball.speed *= 1.5;
    this.game.ball.normalizeVelocity();
    this.game.ball.speed = this.game.speed;

    this.uses--;
};

var IceBall = function() { 
    Powerup.apply(this, arguments);
    this.uses = 3; 
};

IceBall.prototype.constructor = IceBall;
IceBall.prototype.name = "ICEBALL";
IceBall.prototype.description = "Description";
IceBall.prototype.icon = makeIcon("expand42");

IceBall.prototype.action = function() {
    this.game.ball.speed = this.game.speed;
    this.game.ball.normalizeVelocity();
    this.game.ball.speed *= 0.5;

    this.uses--;

    if (!this.uses) {
        this.game.ball.speed = this.game.speed;
    }
};