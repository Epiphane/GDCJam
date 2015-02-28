function InGame() {
    // Initial variables
    this.speed = 10;
    this.p1Score = 0;
    this.p2Score = 0;

    // Time you must hold a key to confirm your powerup
    this.timeToGetPowerup = 100;

    this.experience = [90, 90];
    this.expWidth = [0, 0];
    this.powerups = [[], []];
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
                         ballSize, 10);

    this.player1.setPowerups(this.powerups[0]);
    this.player2.setPowerups(this.powerups[1]);

    this.powerupChoices = [];
    this.powerupChoice = {
        player: -1,
        choice: 0,
        time: 0
    };

    this.pause = true;
    this.countdown = 4000;
    this.numSoundsToPlay = 3;
    this.lastTime = new Date();
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
    if (this.pause) {
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

            if (keyDown[upKey]) {
                if (this.powerupChoice.choice === 0)
                    this.powerupChoice.time ++;
                else {
                    this.powerupChoice.choice = 0
                    this.powerupChoice.time = 0;
                }
            }
            if (keyDown[downKey]) {
                if (this.powerupChoice.choice === 1)
                    this.powerupChoice.time ++;
                else {
                    this.powerupChoice.choice = 1
                    this.powerupChoice.time = 0;
                }
            }

            if (this.powerupChoice.time > this.timeToGetPowerup) {
                this.selectPowerup(this.powerupChoices[this.powerupChoice.choice].powerup);
            }
        }

        if (this.countdown) {
            var thisTime = new Date();
            var dt = thisTime - this.lastTime;
            this.lastTime = thisTime;

            this.countdown -= dt;

            if (this.countdown <= 0) {
                this.countdown = 0;
                this.pause = false;
            }
        }

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


    var padding = 20;
    var expBarWidth = gameSize.width / 2 - (2 * padding + 50);

    for(var i = 0; i < 2; i ++) {
        // Fill with gradient
        if (this.expWidth[i] < this.experience[i])
            this.expWidth[i] ++;
        if (this.expWidth[i] > this.experience[i])
            this.expWidth[i] -= 2;

        var p2Width = expBarWidth * this.expWidth[i] / 100;
        context.fillStyle = grds[i];
        if (i === 0)
            context.fillRect(padding, padding, expBarWidth * this.expWidth[i] / 100, padding * 2);
        else
            context.fillRect(gameSize.width - padding - p2Width, padding, p2Width, padding * 2);
    }
};

InGame.prototype.draw = function(context) {
    var scores = this.p1Score.toString() + "   " + this.p2Score.toString();

    this.drawExperiences();

    context.fillStyle = "white";
    context.font = "50px Poiret One";
    var scoreWidth = context.measureText(scores).width;
    context.fillText(scores, (gameSize.width / 2) - (scoreWidth / 2), 50);

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
            var maxSize = 1000;
            var fontSize = maxSize - maxSize * timeToNext;

            context.fillStyle = "rgba(255, 255, 255, " + 2 * timeToNext * (1 - timeToNext) + ")";
            context.font = fontSize + "pt Arial Black";
            var textSize = context.measureText(text);
            context.fillText(text, (gameSize.width / 2) - (textSize.width / 2),
                                   (gameSize.height / 2) + fontSize / 2);
        }
    }

    context.restore();

    // Draw powerupChoices!
    for (var i = 0; i < this.powerupChoices.length; i ++) {
        this.powerupChoices[i].draw(context);
    }
};
