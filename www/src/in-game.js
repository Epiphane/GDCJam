function InGame() {
    // Initial variables
    this.speed = 10;
    this.p1Score = 0;
    this.p2Score = 0;

    this.p1shield = false;
    this.p2shield = false;

    // Time you must hold a key to confirm your powerup
    this.timeToGetPowerup = 100;
    this.timeToGetReady = 100;

    this.experience = [0, 90];
    this.expWidth = [0, 0];
    this.powerups = [[], []];
    this.particles = [];

    this.gameDone = 0;
    this.highscore = 0;

    this.cardFrame = 0;
    this.cardAlpha = 2;
    this.scoreToWin = 5;

    this.p1ReadyHeight = 0;
    this.p2ReadyHeight = 0;
    this.p1Ready = false;
    this.p2Ready = false;
    this.readyToStart = false;
    this.readyDelay = 0;
}

InGame.prototype.init = function() {
    var distFromEdge = 20;
    var initialSize = { w: 20, h: 140 };
    var ballSize = 20;

    // "Entities"
    this.player1 = new Paddle(distFromEdge, gameSize.height / 2, initialSize.w, initialSize.h);
    this.player2 = new Paddle(gameSize.width - distFromEdge, gameSize.height / 2, initialSize.w, initialSize.h);
    this.ball = new Ball(gameSize.width / 2 - ballSize / 2,
            gameSize.height / 2 - ballSize / 2,
            ballSize, this.speed);

    this.ball.juice = {
        color: true,
        trail: true,
        bounce: true,
        speedup: true,
        sound: true
    };

    this.player1.juice = this.player2.juice = {
        color: true,
        bounce: true
    };

    this.player1.setPowerups(this.powerups[0]);
    this.player2.setPowerups(this.powerups[1]);

    this.powerupChoices = [];
    this.powerupChoice = {
        player: -1,
        choice: 0,
    };

    this.powerupChoiceHeight = 0; // Goes UP when the user holds W/Up until it reaches the timeToGetPowerup
    // If you hold down this thing goes NEGATIVE yo

    this.pause = true;
    this.countdown = 4000;
    this.numSoundsToPlay = 3;
    this.lastTime = new Date();

    this.particles = [];
    this.gameDone = 0;
    this.highscore = 0;
    this.cardFrame = 0;
    this.cardAlpha = 2;

    this.juice = {
        background: false,
        expBarColor: true,
        countdown: true
    };

    this.juice.background = new Image();
    this.juice.background.src = "http://placekitten.com/g/1024/768";

    this.fadeArrows = [];
};

InGame.prototype.giveExperience = function(player) {
    this.experience[player] += 10;

    if (this.experience[player] >= 100) {
        this.pause = true;

        this.powerupChoice.player = player;
        this.powerupChoice.time = this.powerupChoice.choice = 0;
        this.powerupChoices.push(new PowerupOption(player, 0, Powerup.getRandomPowerup(player)));
        this.powerupChoices.push(new PowerupOption(player, 1, Powerup.getRandomPowerup(player)));
    }
};

InGame.prototype.selectPowerup = function(PowerupCstr) {
    // Reset powerup stuff
    this.experience[this.powerupChoice.player] = 0;
    this.powerupChoices = [];
    this.powerupChoiceHeight = 0;



    if (this.powerupChoice.player === 0)
        this.player1.addPowerup(new PowerupCstr(this, this.player1));
    else
        this.player2.addPowerup(new PowerupCstr(this, this.player2));

    this.pause = false;
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function() {
    // Fade the effect arrows if necessary
    for (var ndx = this.fadeArrows.length - 1; ndx >= 0; ndx--) {
        if (this.fadeArrows[ndx].scale < 0) {
            this.fadeArrows[ndx].scale -= 0.05;
        }
        else {
            this.fadeArrows[ndx].scale += 0.05;
        }
        this.fadeArrows[ndx].alpha -= 0.03;
        if (this.fadeArrows[ndx].alpha < 0) {
            this.fadeArrows.splice(ndx, 1);
        }
    }

    if (this.readyDelay != 0) {
        this.readyDelay--;
        if (this.readyDelay == 0) {
            this.readyToStart = true;
            this.countdown = 4000;
        }
    }

    // ask players to get ready
    if (!this.readyToStart) {
        if (!this.p1Ready) {
            if (keyDown[KEYS.W] && this.p1ReadyHeight > -1) {
                this.p1ReadyHeight += 2;
                chooseDOWN.stop();
                chooseDOWNREV.stop();
                chooseUPREV.stop();
                chooseUP.play();
            }
            else {
                this.p1ReadyHeight *= 0.8;
                if (chooseUP.getPercent() > 0) {
                    chooseUPREV.play();
                    chooseUPREV.setPercent(120 - chooseUP.getPercent());
                }

                if (chooseDOWN.getPercent() > 0) {
                    chooseDOWNREV.play();
                    chooseDOWNREV.setPercent(120 - chooseDOWN.getPercent());
                }

                chooseUP.stop();
                chooseDOWN.stop();
            }

            if (this.p1ReadyHeight > this.timeToGetReady) {
                this.p1Ready = true;
                readySound.play();
                chooseUP.stop();
                this.createFadeArrow(ARROW_MARGIN, 80, 1);
                if (this.p2Ready) {
                    this.readyDelay = 50;
                }
            }
        }

        if (!this.p2Ready) {
            if (keyDown[KEYS.UP] && this.p2ReadyHeight > -1) {
                this.p2ReadyHeight += 2;
                chooseDOWN2.stop();
                chooseDOWNREV2.stop();
                chooseUPREV2.stop();
                chooseUP2.play();
            }
            else {
                this.p2ReadyHeight *= 0.8;
                if (chooseUP2.getPercent() > 0) {
                    chooseUPREV2.play();
                    chooseUPREV2.setPercent(120 - chooseUP2.getPercent());
                }

                if (chooseDOWN2.getPercent() > 0) {
                    chooseDOWNREV2.play();
                    chooseDOWNREV2.setPercent(120 - chooseDOWN2.getPercent());
                }

                chooseUP2.stop();
                chooseDOWN2.stop();
            }

            if (this.p2ReadyHeight > this.timeToGetReady) {
                this.p2Ready = true;
                readySound2.play();
                chooseUP2.stop();
                this.createFadeArrow(gameSize.width - ARROW_MARGIN, 80, 1);
                if (this.p1Ready) {
                    this.readyDelay = 50;
                }
            }
        }

    }
    else {


        if (this.powerupChoices.length > 0) {
            var upKey, downKey;
            if (this.powerupChoice.player === 0) {
                upKey = KEYS.W;
                downKey = KEYS.S;
            }
            else {
                upKey = KEYS.UP;
                downKey = KEYS.DOWN;
            }

            if (keyDown[upKey] && this.powerupChoiceHeight > -1) {
                this.powerupChoiceHeight += 2;
                chooseDOWN.stop();
                chooseDOWNREV.stop();
                chooseUPREV.stop();
                chooseUP.play();
            }
            else if (keyDown[downKey] && this.powerupChoiceHeight < 1) {
                this.powerupChoiceHeight -= 2;
                chooseUP.stop();
                chooseUPREV.stop();
                chooseDOWNREV.stop();
                chooseDOWN.play();
            }
            else {
                this.powerupChoiceHeight *= 0.8;

                if (chooseUP.getPercent() > 0) {
                    chooseUPREV.play();
                    chooseUPREV.setPercent(120 - chooseUP.getPercent());
                }

                if (chooseDOWN.getPercent() > 0) {
                    chooseDOWNREV.play();
                    chooseDOWNREV.setPercent(120 - chooseDOWN.getPercent());
                }

                chooseUP.stop();
                chooseDOWN.stop();
            }

            if (this.powerupChoiceHeight > this.timeToGetPowerup) {
                chooseUP.stop();
                chooseUPREV.stop();
                chooseDOWN.stop();
                chooseDOWNREV.stop();
                this.selectPowerup(this.powerupChoices[0].powerup);
            }

            if (this.powerupChoiceHeight < -this.timeToGetPowerup) {
                chooseUP.stop();
                chooseUPREV.stop();
                chooseDOWN.stop();
                chooseDOWNREV.stop();
                this.selectPowerup(this.powerupChoices[1].powerup);
            }
        }

        if (this.p1Score > this.p2Score) {
            this.highscore = this.p1Score;
            if (this.highscore >= this.scoreToWin) {
                this.gameDone = 1;
            }
        }
        else {
            this.highscore = this.p2Score;
            if (this.highscore >= this.scoreToWin) {
                this.gameDone = 2;
            }
        }

        if (this.gameDone) {
            this.winSequence();
        }
        else {

            if (this.countdown && !this.gameDone) {
                var thisTime = new Date();
                var dt = thisTime - this.lastTime;
                this.lastTime = thisTime;

                this.countdown -= dt;

                if (this.countdown <= 0) {
                    this.countdown = 0;
                    this.pause = false;
                }
            }

            if (this.pause) {
                return;
            }

            if (keyDown[KEYS.UP]) {
                this.player2.accelerate(-this.speed);
            }
            if (keyDown[KEYS.DOWN]) {
                this.player2.accelerate(this.speed);
            }

            if (keyDown[KEYS.W]) {
                this.player1.accelerate(-this.speed);
            }
            if (keyDown[KEYS.S]) {
                this.player1.accelerate(this.speed);
            }

            this.player1.update();
            this.player2.update();
            this.ball.update(this);

            if (this.ball.win) {
                if (this.ball.win === 1) {
                    this.p1Score++;
                }
                else {
                    this.p2Score++;
                }

                this.pause = true;
                this.init();
            }
        }
    }
};

InGame.prototype.drawExperiences = function() {
    var grds = [
        context.createLinearGradient(0.000, 150.000, gameSize.width / 2 - 100, 150.000),
        context.createLinearGradient(gameSize.width / 2 + 100, 150.000, gameSize.width, 150.000)
    ];
    grds[0].addColorStop(0.000, 'rgba(0, 255, 0, 1.000)');
    grds[0].addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
    grds[0].addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
    grds[0].addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');

    grds[1].addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
    grds[1].addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
    grds[1].addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
    grds[1].addColorStop(1.000, 'rgba(0, 255, 0, 1.000)');

    if (!this.juice.expBarColor) {
        grds[0] = "rgba(255, 255, 0, 1)";
        grds[1] = "rgba(255, 255, 0, 1)";
    }

    var padding = 50;
    var expBarHeight = 23;
    var expBarWidth = gameSize.width / 2 - (2 * padding + 75);

    for(var i = 0; i < 2; i ++) {
        // Fill with gradient
        var diff = this.experience[i] - this.expWidth[i];
        this.expWidth[i] += diff / 7;

        var p2Width = expBarWidth * this.expWidth[i] / 100;
        context.fillStyle = grds[i];
        if (i === 0)
            context.fillRect(padding, padding, expBarWidth * this.expWidth[i] / 100, expBarHeight);
        else
            context.fillRect(gameSize.width - padding - p2Width, padding, p2Width, expBarHeight);
    }

    // Draw the gray box around em
    var boxMargin = 5;
    var boxY = padding - boxMargin;
    var boxWidth = expBarWidth + boxMargin * 2;
    var boxHeight = expBarHeight + boxMargin * 2;
    context.strokeStyle = "rgb(100, 100, 100)";
    context.lineWidth = 3;
    context.strokeRect(padding - boxMargin,
            boxY,
            boxWidth,
            boxHeight);
    context.strokeRect(gameSize.width - padding - boxMargin - expBarWidth,
            boxY,
            boxWidth,
            boxHeight);
};

var ARROW_SHAFT_WIDTH = 20;
var ARROW_TIP_BASE_WIDTH = 40;
var ARROW_HEAD_LENGTH = 100;
var ARROW_SHAFT_HEIGHT = 30;

var jankyArrowScale = 1;
function drawArrow(arrowX, fillPercent, xScale, yScale, fillStyle, strokeStyle) {
   // FILL ARROW
    context.save();
    
	context.translate(arrowX, gameSize.height/2 - yScale * 65);
    context.scale(xScale, yScale);
    

    var clipY = -fillPercent * (ARROW_HEAD_LENGTH + ARROW_SHAFT_HEIGHT) + ARROW_SHAFT_HEIGHT
    context.rect(-1000,
                 clipY, 
                 2000, 
                 1000);
    context.clip();

    context.scale(jankyArrowScale, jankyArrowScale);
    context.beginPath();
    context.moveTo(-ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    context.lineTo(-ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo(-ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo(  0, -ARROW_HEAD_LENGTH);  // Arrow point
    context.lineTo( ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo( ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo( ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    context.closePath();

    context.fillStyle = fillStyle;
    context.fill();
    context.restore();

    
    // ARROW OUTLINE
	context.save();

	context.translate(arrowX, gameSize.height/2 - yScale * 65);
    context.scale(1, yScale);
    
    context.beginPath();
    context.moveTo(-ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    context.lineTo(-ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo(-ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo(  0, -ARROW_HEAD_LENGTH);  // Arrow point
    context.lineTo( ARROW_TIP_BASE_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo( ARROW_SHAFT_WIDTH, -ARROW_SHAFT_HEIGHT);
    context.lineTo( ARROW_SHAFT_WIDTH,  ARROW_SHAFT_HEIGHT);
    context.closePath();

    context.strokeStyle = strokeStyle;
    context.lineWidth = 5;
    context.stroke();

    context.restore();
}

InGame.prototype.createFadeArrow = function(x, y, scale) {
    this.fadeArrows.push( {x: x, y: y, scale: scale, alpha: 0.8 } );
}

var ARROW_MARGIN = 150;
InGame.prototype.drawPowerupArrows = function() {
    var arrowX = 0;
    if (this.powerupChoices.length > 0) {
        if (this.powerupChoice.player == 0) {
            arrowX = ARROW_MARGIN;
        }
        else {
            arrowX = gameSize.width - ARROW_MARGIN;
        }

        var fillHeight = this.powerupChoiceHeight / this.timeToGetPowerup;
        var arrowGradient = context.createLinearGradient(150.000, 0.000, 150.000, 300.000);
      
        // Add colors
        arrowGradient.addColorStop(0.000, 'rgba(255, 255, 86, 1.000)');
        arrowGradient.addColorStop(1.000, 'rgba(127, 0, 127, 1.000)');

        if (fillHeight < 0) {
            drawArrow(arrowX, -fillHeight, 1, -1, arrowGradient, "white");
            drawArrow(arrowX, 0,           1,  1, arrowGradient, "white");
        }
        else {
            drawArrow(arrowX, 0,           1, -1, arrowGradient, "white");
            drawArrow(arrowX, fillHeight,  1,  1, arrowGradient, "white");
        }
    }
}

InGame.prototype.drawReadyArrows = function() {
    var readyGradient = context.createLinearGradient(150.000, 0.000, 150.000, 300.000);

    // Add colors
    readyGradient.addColorStop(0.000, 'rgba(33, 127, 7, 1.000)');
    readyGradient.addColorStop(0.994, 'rgba(0, 255, 0, 1.000)');

    // P1 arrow
    var p1Fill = this.p1ReadyHeight / this.timeToGetReady;
    drawArrow(ARROW_MARGIN, p1Fill, 1, 1, readyGradient, "white");

    // P2 arrow
    var p2Fill = this.p2ReadyHeight / this.timeToGetReady;
    drawArrow(gameSize.width - ARROW_MARGIN, p2Fill, 1, 1, readyGradient, "white");
}

var floatOffset = 0;

InGame.prototype.draw = function(context) {

    if (this.juice.background && !this.gameDone) {
        context.drawImage(this.juice.background, 0, 0, gameSize.width, gameSize.height);

        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, gameSize.width, gameSize.height);
    }

    var scores = this.p1Score.toString() + "   " + this.p2Score.toString();

    context.fillStyle = "white";
    context.font = "50px Poiret One";
    var scoreWidth = context.measureText(scores).width;
    context.fillText(scores, (gameSize.width / 2) - (scoreWidth / 2), 50);

    if (!this.readyToStart) {
        this.drawReadyArrows();
        this.player1.draw(context);
        this.player2.draw(context);

        this.ball.draw(context);

        context.font = "30pt Arial";
        context.fillStyle = this.p1Ready ? "green" : "white";
        var text = this.p1Ready ? "READY!" : "READY?";
        
        var textLength = context.measureText(text).width;

        context.fillText(text, ARROW_MARGIN - textLength/2, 140 + Math.sin(floatOffset) * 15);

        text = this.p2Ready ? "READY!" : "READY?";
        context.fillStyle = this.p2Ready ? "green" : "white";
        textLength = context.measureText(text).width;

        context.fillText(text, gameSize.width - ARROW_MARGIN - textLength/2, 140 + Math.sin(floatOffset) * 15);

        floatOffset += 0.1;

        text = "[W]";
        context.fillStyle = "white";
        textLength = context.measureText(text).width;
        context.fillText(text, ARROW_MARGIN - textLength/2, 450);
        text = "[UP]";
        textLength = context.measureText(text).width;
        context.fillText(text, gameSize.width - ARROW_MARGIN - textLength/2, 450);
    }
    else {

        if (!this.gameDone) {
            this.drawPowerupArrows();
            this.drawExperiences();

            this.player1.draw(context);
            this.player2.draw(context);

            this.ball.draw(context);

            // Draw countdown
            if (this.countdown > 200) {
                if (this.countdown < 4000) {
                    var seconds = Math.floor(this.countdown / 1000);
                    if (this.numSoundsToPlay >= seconds) {
                        this.numSoundsToPlay == 0 ? startSound2.play() : startSound1.play();
                        this.numSoundsToPlay = this.numSoundsToPlay - 1;
                    }

                    var text;
                    if (this.countdown > 1000)
                        text = seconds.toString();
                    else
                        text = 'GO!';

                    var timeToNext = (this.countdown % 1000) / 1000;
                    var maxSize = 600;
                    var fontSize = maxSize - maxSize * timeToNext;

                    if (!this.juice.countdown)
                        fontSize = 200;

                    context.fillStyle = "rgba(255, 255, 255, " + 2 * timeToNext * (1 - timeToNext) + ")";
                    context.font = fontSize + "pt Arial Black";
                    var textSize = context.measureText(text);
                    context.fillText(text, (gameSize.width / 2) - (textSize.width / 2),
                            (gameSize.height / 2) + fontSize / 2);
                }
            }

            // Draw powerupChoices!
            for (var i = 0; i < this.powerupChoices.length; i ++) {
                this.powerupChoices[i].draw(context);
            }
        }
        else {
            if (keyDown[KEYS.SPACE])
                changeState(new TitleScreen());

            if (this.cardFrame % 3 === 0) {
                for (var l = 0; l < this.particles.length; l ++) {
                    this.particles[l].draw(context, (this.cardAlpha > 1 ? 1 : this.cardAlpha));
                }
                this.cardAlpha *= 0.99;

            }

            if (this.cardAlpha < 0.05) {
                context.fillStyle = "rgba(0, 0, 0, 0.1)";
                context.fillRect(0, 0, gameSize.width, gameSize.height);

                if (this.particles.length > 0 && Math.random() < 0.3) {
                    this.particles.splice(0, 1);

                    if (this.particles.length === 0)
                        setTimeout(function() {
                            changeState(new TitleScreen());
                        }, 1000);
                }
            }        
        }
    }
    
    // Draw fade arrows as necessary
    for (var ndx = 0; ndx < this.fadeArrows.length; ndx++) {
        var currArrow = this.fadeArrows[ndx];
        jankyArrowScale = currArrow.scale;
        drawArrow(currArrow.x, 2, 1, 1, "rgba(255, 255, 255, " + currArrow.alpha + ")", "rgba(0, 0, 0, 0)");
        jankyArrowScale = 1;
    }
};

InGame.prototype.winSequence = function() {
    if (this.cardFrame-- <= 0) {
        this.cardFrame = 24;

        if (this.particles.length > 52)
            return;

        var cwidth = this.player1.getWidth();
        var cheight = this.player1.getHeight();

        var newParticle = function ( x, y, direction ) {
            card = Math.floor(Math.random() * 52);

            var particle = new Particle(card, x, y + cheight / 2, direction * 4, - Math.random() * 16 , cwidth, cheight);

            return particle;
        }

        if (this.cardAlpha === 2) {
            if (this.gameDone === 1) {
                this.particles.push(newParticle(this.player1.getX(), this.player1.getY(), 1));
            }
            else {
                this.particles.push(newParticle(this.player2.getX(), this.player2.getY(), -1));
            }
        }
        else {
            this.particles.push(newParticle(Math.random() * gameSize.width, Math.random() * gameSize.height, Math.random() * 2 - 1));
        }
    }
        
    for (var l = 0; l < this.particles.length; l ++) {
        this.particles[l].update(context);
    }
};
