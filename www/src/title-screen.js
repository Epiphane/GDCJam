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
        context.fillStyle = "rgb(255, 0, 0)";
    }
    else {
        context.fillStyle = "rgb(50, 50, 50)";
    }
    context.strokeStyle = "rgb(255, 255, 255)";
    context.lineWidth = 5;

    context.fillRect(  this.bouncedButton.shape.pos.x + this.swoopValue, this.bouncedButton.shape.pos.y, this.bouncedButton.width, this.bouncedButton.height);
    context.strokeRect(this.bouncedButton.shape.pos.x + this.swoopValue, this.bouncedButton.shape.pos.y, this.bouncedButton.width, this.bouncedButton.height);

    drawCenteredText("JUICY PONG", "40pt", "rgb(255, 170, 170)", gameSize.height/2 - 100, -this.swoopValue);
    drawCenteredText("PLAY", "30pt", "rgb(255, 170, 170)", gameSize.height/2 + 100, this.swoopValue);

    // If the play button is all the way off the screen, WE OUT FOOLS
    if (this.bouncedButton.shape.pos.x + this.swoopValue > gameSize.width) {
        startGame();
    }
};

