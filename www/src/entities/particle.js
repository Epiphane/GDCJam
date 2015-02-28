/** Particle class */

var Particle = function ( id, x, y, sx, sy, cwidth, cheight ) {
    this.hue = 0;

    this.x = x;
    this.y = y;

    if ( sx === 0 ) sx = 2;
    this.sx = sx;
    this.sy = sy;

    this.cx = ( id % 4 ) * cwidth;
    this.cy = Math.floor( id / 4 ) * cheight;

    this.cwidth = cwidth;
    this.cheight = cheight;
};

Particle.prototype.isDead = function() {
    return this.x < -this.cwidth / 2 || this.x > gameSize.width + this.cwidth / 2;
}

Particle.prototype.draw = function (context) {
    this.x += this.sx;
    this.y += this.sy;

    if (this.y > gameSize.height - this.cheight / 2) {
        this.y = gameSize.height - this.cheight / 2;
        this.sy *= -0.85;
    }

    this.sy += 0.98;

    var rgb = HSVtoRGB(this.hue, 1, 1);
    this.hue += 0.04;
    while(this.hue >= 1) this.hue --;

    context.fillStyle = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    context.fillRect(Math.floor(this.x - this.cwidth / 2), Math.floor(this.y - this.cheight / 2), this.cwidth, this.cheight);
    
    return true;
};