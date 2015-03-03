/** 
 * Rectangles bounce when you click on em.  Iterate that animation here.
 */
function iterateBounciness(rect) {
   var bounceFactor = (Math.sin(rect.bounceTime) + 1) * rect.bounceTime * 0.15;
   if (rect.bounceTime > 0) {
       rect.bounceTime--;
   }

   shape = rect.shape
 
   bounceX = shape.pos.x - bounceFactor;
   bounceY = shape.pos.y - bounceFactor;
   bounceWidth  = rect.width  + bounceFactor * 2;
   bounceHeight = rect.height + bounceFactor * 2;
   return { shape: new SAT.Box(new SAT.Vector(bounceX, bounceY), 0, 0),
       width:  bounceWidth,
       height: bounceHeight };
}

function drawCenteredText(text, size, color, yPos, swoop) {
    context.font = size + " Arial";
    context.fillStyle = color;

    var textLength = context.measureText(text).width;

    context.fillText(text, gameSize.width/2 - textLength/2 + swoop, yPos); 
}


function TitleScreen() {
    this.buttonHovered = false; // TRUE if user hovering over button
    this.buttonAlreadyBounced = false;  // don't bounce button twice holmes
    this.swoopValue = 0; // SWOOOOP the UI elements off screen when we hit GO
    this.clickedPlay = false;
    this.hue = 0;

    this.button = { 
        shape: new SAT.Box(new SAT.Vector(gameSize.width/2 - 100, gameSize.height/2 + 100 - 40 + 2), 200, 50).toPolygon(), 
        bounceTime: 0,
        width: 200,
        height: 50,
    };

    this.bouncedButton = new Paddle(0, 0, 0, 0);
};

TitleScreen.prototype.init = function() {
    var self = this;

    document.addEventListener("mousemove", function(evt) {
        evt = getCanvasCoords(evt);
        if (SAT.pointInPolygon(new SAT.Vector(evt.x, evt.y), self.button.shape)) {
            self.buttonHovered = true;
            if (!self.buttonAlreadyBounced) {
                self.button.bounceTime = 40;
                self.buttonAlreadyBounced = true;
                mouseOverSound.play();
            }
        }    
        else {
            self.buttonHovered = false;   
            self.buttonAlreadyBounced = false;
        }
    });

    document.addEventListener("mousedown", function(evt) {
        evt = getCanvasCoords(evt);
        if (SAT.pointInPolygon(new SAT.Vector(evt.x, evt.y), self.button.shape)) {
            clickedSound.play();
            self.clickedPlay = true;
        }
    });
};

// See if the button's bouncin', and keep it on bouncin thoooo
TitleScreen.prototype.update = function() {
    this.bouncedButton = iterateBounciness(this.button); 

    if (this.clickedPlay) {
        if (this.swoopValue == 0) {
            this.swoopValue = 3;
        }
        this.swoopValue *= 1.25;
    }
};

TitleScreen.prototype.draw = function() {
    // Draw the buttons
    if (this.buttonHovered) {
        context.fillStyle = "rgb(255, 255, 255)";
    }
    else {
        context.fillStyle = "rgb(50, 50, 50)";
    }
    context.strokeStyle = "rgb(255, 255, 255)";
    context.lineWidth = 5;

    context.fillRect(  this.bouncedButton.shape.pos.x + this.swoopValue, this.bouncedButton.shape.pos.y, this.bouncedButton.width, this.bouncedButton.height);
    context.strokeRect(this.bouncedButton.shape.pos.x + this.swoopValue, this.bouncedButton.shape.pos.y, this.bouncedButton.width, this.bouncedButton.height);

    this.rgb = HSVtoRGB(this.hue, 0.6, 1);
    this.hue += 0.04;
    while (this.hue >= 1) {
        this.hue--;
    }
    var color = "rgb(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ")";

    drawCenteredText("JUICY PONG", "40pt", "rgb(255, 255, 255)", gameSize.height/2 - 100, -this.swoopValue);
    drawCenteredText("PLAY", "30pt", color, gameSize.height/2 + 100, this.swoopValue);

    // If the play button is all the way off the screen, WE OUT FOOLS
    if (this.bouncedButton.shape.pos.x + this.swoopValue > gameSize.width) {
        startGame();
    }
};

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
