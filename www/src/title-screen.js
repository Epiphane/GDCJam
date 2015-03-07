function TitleScreen() {
    this.buttonHovered = false; // TRUE if user hovering over button
    this.buttonAlreadyBounced = false;  // don't bounce button twice holmes
    this.swoopValue = 0; // SWOOOOP the UI elements off screen when we hit GO
    this.clickedPlay = false;
    this.bounceTime = 0;

    this.button = new SAT.Box(GAME_CENTER.add(new SAT.Vector(-100, 62)), 200, 50);

    // Create title and button
    this.title = renderText('JUICY PONG', '40pt Arial', 'white');
    this.play = {
        text: 'PLAY',
        hue: 0
    };
    this.play.canvas = renderText(this.play.text, '34pt Arial', 'white');
    this.play.context = this.play.canvas.getContext('2d');
};

TitleScreen.prototype.init = function() {
    var self = this;

    this.game.on('mousemove', function(pos) {
        if (SAT.pointInPolygon(new SAT.Vector(pos.x, pos.y), self.button.toPolygon())) {
            self.buttonHovered = true;
            if (!self.buttonAlreadyBounced) {
                self.bounceTime = 40;
                self.buttonAlreadyBounced = true;
                mouseOverSound.play();
            }
        }    
        else {
            self.buttonHovered = false;   
            self.buttonAlreadyBounced = false;
        }
    });

    this.game.on('mousedown', function(pos) {
        if (SAT.pointInPolygon(new SAT.Vector(pos.x, pos.y), self.button.toPolygon())) {
            clickedSound.play();
            self.clickedPlay = true;
        }
    });
};

// See if the button's bouncin', and keep it on bouncin thoooo
TitleScreen.prototype.update = function() {
    if (this.clickedPlay) {
        if (this.swoopValue == 0) {
            this.swoopValue = 3;
        }
        this.swoopValue *= 1.25;
    }

    if (this.swoopValue > GAME_CENTER.x + this.title.width) {
        this.game.setState(new ReadyScreen());
    }
};

TitleScreen.prototype.render = function(context) {
    // Draw the button
    if (this.buttonHovered) {
        context.fillStyle = "rgb(255, 255, 255)";
    }
    else {
        context.fillStyle = "rgb(50, 50, 50)";
    }
    context.strokeStyle = "rgb(255, 255, 255)";
    context.lineWidth = 5;

    var button = bounce(this.button, this.bounceTime);
    if (this.bounceTime > 0)
        this.bounceTime --;

    context.fillRect(button.pos.x + this.swoopValue, button.pos.y, button.w, button.h);
    context.strokeRect(button.pos.x + this.swoopValue, button.pos.y, button.w, button.h);

    // Redraw PLAY in raiiiinbow!
    this.play.hue += 0.004;
    while (this.play.hue >= 1) {
        this.play.hue--;
    }
    var rgb = HSVtoRGB(this.play.hue, 0.6, 1);
    this.play.context.clearRect(0, 0, this.play.canvas.width, this.play.canvas.height);
    this.play.context.fillStyle = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    this.play.context.fillText(this.play.text, 0, 0);

    // Draw the text (JUICY PONG + PLAY)
    context.drawImage(this.title,       GAME_CENTER.x - this.title.width / 2       - this.swoopValue,
        100);
    context.drawImage(this.play.canvas, GAME_CENTER.x - this.play.canvas.width / 2 + this.swoopValue,
        this.button.pos.y);
};
