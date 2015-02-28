/* Powerup Service */
var Powerup = function(game, player) {
    this.uses = 6;
    this.game = game;
    this.player = player;
};
Powerup.name = "Nothing";
Powerup.description = "You shouldn't be seeing this, you dingus!";

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

var WideBar = function() {};
WideBar.name = "Wide Paddle";
WideBar.description = "May your paddle be wide and your future be bright!";

WideBar.prototype = Powerup.prototype;
WideBar.prototype.constructor = WideBar;

WideBar.prototype.start = function() {
    this.originalHeight = this.player.getHeight();

    this.player.setHeight(this.originalHeight * 1.5);
    this.player.updateShape();
};
WideBar.prototype.done = function() {
    this.player.setHeight(this.originalHeight);
    this.player.updateShape();
};