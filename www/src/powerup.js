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
        return WideBar;
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