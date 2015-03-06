function InGame() {
    // Initial variables
    this.speed = 10;
    this.p1Score = 0;
    this.p2Score = 0;

    var initialSize = { w: 20, h: 140 };
    this.ballSize = 20;

    this.portals = false;
    this.portal1 = {x: 0, y: 0, width: 0};
    this.portal2 = {x: 0, y: 0, width: 0};

    this.shape1 = null;
    this.shape2 = null;
    // Time you must hold a key to confirm your powerup
    this.timeToGetPowerup = 100;
    this.timeToGetReady = 100;

    this.expPerHit = 25;
    this.expPerWin = 50;
    this.experience = [0, 0];
    this.expWidth = [0, 0];
    this.particles = [];

    this.gameDone = 0;
    this.highscore = 0;

    this.cardFrame = 0;
    this.cardAlpha = 2;

    this.chosePowerupDelay = 0;

    this.scoreToWin = 7;

    this.juiceLevel = 0;

    // this.background = new Image();
    // this.background.src = "http://placekitten.com/g/1024/768";

    this.background = new Image();
    this.background.src = "./asset/juice.png";

    this.players = [new Player(0), new Player(1)];
    this.ball = new Ball(0, 0, this.ballSize, this.speed);

    var distFromEdge = 20;
    this.players[0].setX(distFromEdge);
    this.players[1].setX(GAME_WIDTH - distFromEdge - this.players[1].getWidth());
    this.players[0].setY(GAME_HEIGHT / 2 - this.players[0].getHeight() / 2);
    this.players[1].setY(GAME_HEIGHT / 2 - this.players[1].getHeight() / 2);
    this.ball = new Ball(GAME_WIDTH / 2 - this.ballSize / 2,
            GAME_HEIGHT / 2 - this.ballSize / 2,
            this.ballSize, this.speed);

    // Draw UI offscreen so that text isn't rerendered every frame
    this.score = renderText('0 0', '50pt Poiret One', 'white');

    // this.leftShieldGrd = context.createLinearGradient(0.000, 150.000, 10.000, 150.000);

    // // Add colors
    // this.leftShieldGrd.addColorStop(0.000, 'rgba(86, 170, 255, 1.000)');
    // this.leftShieldGrd.addColorStop(1.000, 'rgba(0, 0, 0, 0.000)');

    // this.rightShieldGrd = context.createLinearGradient(GAME_WIDTH - 10, 150.000, GAME_WIDTH, 150.000);

    // // Add colors
    // this.rightShieldGrd.addColorStop(0.000, 'rgba(0, 0, 0, 0.000)');
    // this.rightShieldGrd.addColorStop(1.000, 'rgba(86, 170, 255, 1.000)');
}

InGame.prototype.setJuiceAndAdd = function() {
    this.ball.juice = {
        color: false,
        trail: false,
        bounce: false,
        speedup: true,
        sound: false
    };

    this.players[0].juice = this.players[1].juice = {
        color: false,
        bounce: false
    };

    this.juice = {
        background: juice,
        expBarColor: false,
        countdown: false
    };

    this.expPerHit = 25;
    this.expPerWin = 50;

    switch (this.juiceLevel) {
        case 8:
            this.juice.background = this.background;
        case 7:
        case 6:
        case 5:
            this.ball.juice.color = true;
        case 4:
            this.juice.countdown = true;
        case 3:
            this.juice.expBarColor = true;
        case 2:
            this.ball.juice.trail = true;
            this.players[0].juice.bounce = true;
            this.players[1].juice.bounce = true;
        case 1:
            this.expPerHit = 10;
            this.expPerWin = 40;
            this.players[0].juice.shake = true;
            this.ball.juice.sound = true;
        case 0:
            this.players[0].juice.color = true;
            this.players[1].juice.color = true;
            this.ball.juice.bounce = true;
            break;
        default:
            this.ball.juice.color = true;
            this.juice.countdown = true;
            this.juice.expBarColor = true;
            this.ball.juice.trail = true;
            this.players[0].juice.bounce = true;
            this.players[1].juice.bounce = true;
            this.expPerHit = 10;
            this.expPerWin = 40;
            this.ball.juice.sound = true;
            this.players[0].juice.color = true;
            this.players[1].juice.color = true;
            this.ball.juice.bounce = true;
    }

    this.juiceLevel ++;
};

InGame.prototype.init = function() {
    var distFromEdge = 20;

    // "Entities"
    this.players[0].setX(distFromEdge);
    this.players[1].setX(GAME_WIDTH - distFromEdge - this.players[1].getWidth());
    this.players[0].setY(GAME_HEIGHT / 2 - this.players[0].getHeight() / 2);
    this.players[1].setY(GAME_HEIGHT / 2 - this.players[1].getHeight() / 2);
    this.ball = new Ball(GAME_WIDTH / 2 - this.ballSize / 2,
            GAME_HEIGHT / 2 - this.ballSize / 2,
            this.ballSize, this.speed);

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

    this.fadeArrows = [];
    this.setJuiceAndAdd();
};

var frigginChosePow = 0;
InGame.prototype.giveExperience = function(player, exp) {
    this.experience[player] += (exp || this.expPerHit);

    if (this.experience[player] >= 100) {
        this.pause = true;

        this.powerupChoice.player = player;
        this.powerupChoice.time = this.powerupChoice.choice = 0;
        var opt1 = new PowerupOption(player, 0, Powerup.getRandomPowerup(this, player + 1));
        this.powerupChoices.push(opt1);
        this.powerupChoices.push(new PowerupOption(player, 1, Powerup.getRandomPowerup(this, player + 1)), opt1);
    }
};

InGame.prototype.selectPowerup = function(PowerupCstr) {
    // Reset powerup stuff
    
    if (this.powerupChoice.player === 0) {
        frigginChosePow = (frigginChosePow == 1) ? 0 : 1;
    }
    var powerY = (frigginChosePow == 1) ? GAME_HEIGHT - 80 - 42 : 80+60  ;
    console.log("chose: " +frigginChosePow);

    if (this.powerupChoice.player === 0)
        this.players[0].addPowerup(new PowerupCstr(this, this.players[0]), ARROW_MARGIN - 24, powerY);
    else
        this.players[1].addPowerup(new PowerupCstr(this, this.players[1]), GAME_WIDTH - ARROW_MARGIN - 24, powerY);

    this.chosePowerupDelay = 50;
};

/**
 * Main animation loop!  Check for intersection, update rectangle
 *  objects, and draw to screen.
 */
InGame.prototype.update = function(dt) {
    if (this.chosePowerupDelay != 0) {
        this.chosePowerupDelay--;
        if (this.chosePowerupDelay == 0) {
            this.experience[this.powerupChoice.player] = 0;
            this.powerupChoices = [];
            this.powerupChoiceHeight = 0;
            this.pause = false;
        }
    }

    if (this.powerupChoices.length > 0) {
        var upKey, downKey, leftKey, rightKey;
        if (this.powerupChoice.player === 0) {
            upKey = KEYS.W;
            downKey = KEYS.S;
        }
        else {
            upKey = KEYS.UP;
            downKey = KEYS.DOWN;
        }

        if (keyDown[upKey] && this.powerupChoiceHeight > -1 && this.chosePowerupDelay == 0) {
            this.powerupChoiceHeight += 2;
            chooseDOWN.stop();
            chooseDOWNREV.stop();
            chooseUPREV.stop();
            chooseUP.play();
        }
        else if (keyDown[downKey] && this.powerupChoiceHeight < 1 && this.chosePowerupDelay == 0) {
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

        if (this.powerupChoiceHeight > this.timeToGetPowerup && this.chosePowerupDelay == 0) {
            chooseUP.stop();
            chooseUPREV.stop();
            chooseDOWN.stop();
            chooseDOWNREV.stop();
            this.selectPowerup(this.powerupChoices[0].powerup);
            var arrowX = this.powerupChoice.player == 0 ? ARROW_MARGIN : GAME_WIDTH - ARROW_MARGIN;
            this.createFadeArrow(arrowX, 80, 1);
            frigginChosePow = 0;
        }
        else if (this.powerupChoiceHeight < -this.timeToGetPowerup && this.chosePowerupDelay == 0) {
            chooseUP.stop();
            chooseUPREV.stop();
            chooseDOWN.stop();
            chooseDOWNREV.stop();
            this.selectPowerup(this.powerupChoices[1].powerup);
            var arrowX = this.powerupChoice.player == 0 ? ARROW_MARGIN : GAME_WIDTH - ARROW_MARGIN;
            this.createFadeArrow(arrowX, 80, -1);
            frigginChosePow = 1;
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

        if (this.countdown && !this.gameDone && this.readyToStart) {
            this.countdown -= dt * 25;

            if (this.countdown <= 0) {
                this.countdown = 0;
                this.pause = false;
            }
        }

        if (this.pause) {
            return;
        }

        if (keyDown[KEYS.UP]) {
            this.players[1].accelerate(-this.speed);
        }
        if (keyDown[KEYS.DOWN]) {
            this.players[1].accelerate(this.speed);
        }

        if (keyDown[KEYS.W]) {
            this.players[0].accelerate(-this.speed);

        }
        if (keyDown[KEYS.S]) {
            this.players[0].accelerate(this.speed);
        }

        this.players[0].update(dt);
        this.players[1].update(dt);
        this.ball.update(dt, this);

        if (this.ball.win) {
            if (this.ball.win === 1) {
                this.p1Score++;
                this.giveExperience(0, this.expPerWin);
            }
            else {
                this.p2Score++;
                this.giveExperience(1, this.expPerWin);
            }

            this.uiNeedsUpdate = true;
            this.pause = true;
            this.init();
        }
    }
};

InGame.prototype.drawExperiences = function(context) {
    var grds;
    if (this.juice.expBarColor) {
        grds = [
            context.createLinearGradient(0.000, 150.000, GAME_WIDTH / 2 - 100, 150.000),
            context.createLinearGradient(GAME_WIDTH / 2 + 100, 150.000, GAME_WIDTH, 150.000)
        ];
        grds[0].addColorStop(0.000, 'rgba(0, 255, 0, 1.000)');
        grds[0].addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
        grds[0].addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
        grds[0].addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');

        grds[1].addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
        grds[1].addColorStop(0.365, 'rgba(255, 255, 0, 1.000)');
        grds[1].addColorStop(0.626, 'rgba(255, 255, 0, 1.000)');
        grds[1].addColorStop(1.000, 'rgba(0, 255, 0, 1.000)');
    }
    else {
        grds = ["rgba(100, 100, 100, 1)", "rgba(100, 100, 100, 1)"];
    }

    var padding = 50;
    var expBarHeight = 23;
    var expBarWidth = GAME_WIDTH / 2 - (2 * padding + 75);

    for(var i = 0; i < 2; i ++) {
        // Fill with gradient but not more than 100%
        var diff = (this.experience[i] > 100 ? 100 : this.experience[i]) - this.expWidth[i];
        this.expWidth[i] += diff / 7;

        // Keep animating!!
        if (diff !== 0)
            this.uiNeedsUpdate = true;

        var p2Width = expBarWidth * this.expWidth[i] / 100;
        context.fillStyle = grds[i];
        if (i === 0)
            context.fillRect(padding, padding, expBarWidth * this.expWidth[i] / 100, expBarHeight);
        else
            context.fillRect(GAME_WIDTH - padding - p2Width, padding, p2Width, expBarHeight);
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
    context.strokeRect(GAME_WIDTH - padding - boxMargin - expBarWidth,
            boxY,
            boxWidth,
            boxHeight);
};

InGame.prototype.createFadeArrow = function(x, y, flipped) {
    this.fadeArrows.push( {x: x, y: y, scale: 1, alpha: 0.8, flipped: flipped } );
}

InGame.prototype.drawPowerupArrows = function() {
    var arrowX = 0;
    // if (this.powerupChoices.length > 0) {
    //     if (this.powerupChoice.player == 0) {
    //         arrowX = ARROW_MARGIN;
    //     }
    //     else {
    //         arrowX = GAME_WIDTH - ARROW_MARGIN;
    //     }

    //     var fillHeight = this.powerupChoiceHeight / this.timeToGetPowerup;
    //     var arrowGradient = context.createLinearGradient(150.000, 0.000, 150.000, 300.000);
      
    //     // Add colors
    //     arrowGradient.addColorStop(0.000, 'rgba(255, 255, 86, 1.000)');
    //     arrowGradient.addColorStop(1.000, 'rgba(127, 0, 127, 1.000)');

    //     if (fillHeight < 0) {
    //         drawArrow(arrowX, -fillHeight, 1, -1, arrowGradient, "white");
    //         drawArrow(arrowX, 0,           1,  1, arrowGradient, "white");
    //     }
    //     else {
    //         drawArrow(arrowX, 0,           1, -1, arrowGradient, "white");
    //         drawArrow(arrowX, fillHeight,  1,  1, arrowGradient, "white");
    //     }
    // }
}

InGame.prototype.render = function(context) {
    // if (this.uiNeedsUpdate) {
    //     this.uiNeedsUpdate = false;

    //     this.uiContext.clearRect(0, 0, this.ui.width, this.ui.height);

    //     // Draw score
    //     var scores = this.p1Score.toString() + "   " + this.p2Score.toString();

    //     context.fillStyle = "white";
    //     context.font = "50px Poiret One";
    //     var scoreWidth = context.measureText(scores).width;
    //     context.fillText(scores, (GAME_WIDTH / 2) - (scoreWidth / 2), 50);

    //     // Draw experience bar
    //     this.drawExperiences(this.uiContext);
    // }

    // Draw the background first
    if (!this.gameDone) {
        var x = Math.floor(GAME_WIDTH / 2 - this.background.width / 2);
        var y = Math.floor(GAME_HEIGHT / 2 - this.background.height / 2);

        // Redraw this
        // context.clearRect(x, y, Math.floor(this.juice.background.width), Math.floor(this.juice.background.height));
        
        context.drawImage(this.background, x, y,
            Math.floor(this.background.width), Math.floor(this.background.height));

        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(x, y, Math.floor(this.background.width), Math.floor(this.background.height));

        // Draw shields
        if (this.players[0].hasPowerup(Shield)) {
            context.fillStyle = this.leftShieldGrd;
            context.fillRect(0, 0, 10, GAME_HEIGHT);
        }
        if (this.players[1].hasPowerup(Shield)) {
            context.fillStyle = this.rightShieldGrd;
            context.fillRect(GAME_WIDTH - 10, 0, 10, GAME_HEIGHT);
        }
    }

    // context.drawImage(this.ui, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Game over. Spawn cards and make 'em bounce
    if (this.gameDone) {
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
            context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            if (this.particles.length > 0 && Math.random() < 0.3) {
                this.particles.splice(0, 1);

                if (this.particles.length === 0)
                    setTimeout(function() {
                        changeState(new TitleScreen());
                    }, 1000);
            }
        }
    }

    if (this.portals) {
        context.fillStyle = "blue";
        context.fillRect(this.portal1.x, this.portal1.y, this.ball.getSize() + 10, 100);
        context.fillStyle = "orange";
        context.fillRect(this.portal2.x, this.portal2.y, this.ball.getSize() + 10, 100);
    }

    this.drawPowerupArrows();

    this.players[0].draw(context);
    this.players[1].draw(context);

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
            context.fillText(text, (GAME_WIDTH / 2) - (textSize.width / 2),
                    (GAME_HEIGHT / 2) + fontSize / 2);
        }
    }

    // Draw powerupChoices!
    // for (var i = 0; i < this.powerupChoices.length; i ++) {
    //     this.powerupChoices[i].draw(context, this.powerupChoice.player);
    // }
    
    // Draw fade arrows as necessary
    // for (var ndx = 0; ndx < this.fadeArrows.length; ndx++) {
    //     var currArrow = this.fadeArrows[ndx];
    //     jankyArrowScale = currArrow.scale;
    //     drawArrow(currArrow.x, 2, 1, currArrow.flipped, "rgba(255, 255, 255, " + currArrow.alpha + ")", "rgba(0, 0, 0, 0)");
    //     jankyArrowScale = 1;
    // }
};

InGame.prototype.winSequence = function() {
    if (this.cardFrame-- <= 0) {
        this.cardFrame = 24;

        if (this.particles.length > 52)
            return;

        var cwidth = this.players[0].getWidth();
        var cheight = this.players[0].getHeight();

        var newParticle = function ( x, y, direction ) {
            card = Math.floor(Math.random() * 52);

            var particle = new Particle(card, x, y + cheight / 2, direction * 4, - Math.random() * 16 , cwidth, cheight);

            return particle;
        }

        if (this.cardAlpha === 2) {
            if (this.gameDone === 1) {
                this.particles.push(newParticle(this.players[0].getX() + this.players[0].width / 2, this.players[0].getY(), 1));
            }
            else {
                this.particles.push(newParticle(this.players[1].getX() + this.players[1].width / 2, this.players[1].getY(), -1));
            }
        }
        else {
            this.particles.push(newParticle(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT, Math.random() * 2 - 1));
        }
    }
        
    for (var l = 0; l < this.particles.length; l ++) {
        //this.particles[l].height = 96;
        this.particles[l].update(context);
    }
};
