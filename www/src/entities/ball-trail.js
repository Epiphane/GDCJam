function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

/**
 * Circle class defines those funky circles that emanate out from
 *  where an intersection happens.
 */
var hue = 0;
function BallTrail(x, y, size, direction, life, minHue, maxHue) {
    this.shape = new SAT.Box(new SAT.Vector(x, y), size, size);

    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.direction = direction;
    this.juice = { color: false };

    // this.rgb = {
    //     r: Math.floor(Math.random() * 255),
    //     g: Math.floor(Math.random() * 255),
    //     b: Math.floor(Math.random() * 255),
    // };
    if (!minHue && !maxHue) {
        this.rgb = HSVtoRGB(hue, 0.6, 1);
        hue += 0.04;
        while (hue >= 1) {
            hue--;
        }
    }
    else {
        hue += 0.04;
        if (hue < minHue || hue > maxHue) {
            hue = minHue;
        }
        this.rgb = HSVtoRGB(hue, 0.6, 1);
    }
}

BallTrail.prototype.isAlive = function() { return this.life > 0; };
BallTrail.prototype.getX = function() { return this.shape.pos.x; };
BallTrail.prototype.getY = function() { return this.shape.pos.y; };

BallTrail.prototype.update = function() {
    this.life --;
    this.size *= (this.maxLife - 3) / this.maxLife;
};

BallTrail.prototype.draw = function(context) {

    // save state
    context.save();

    // scale context horizontally
    context.translate(this.getX(), this.getY());
    context.rotate(this.direction);

    if (this.juice.color) {
        context.fillStyle = "rgba(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ", " + this.life / this.maxLife + ")";
    }
    else {
        context.fillStyle = "rgba(255, 255, 255, " + this.life / this.maxLife + ")";
    }
    context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

    context.restore();
}